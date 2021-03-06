import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView
} from 'react-native'

import env from 'react-native-config'

import axios from 'axios'
import { server, showError } from '../commons/common'

export default class Auth extends Component {
    state = {
        stageNew: false,
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        submitting: false,
        submitAnimation: '.',
    }

    intervalAnimation;

    componentDidMount() {
        if (!env.IS_PRODUCTION) {
            setTimeout(() => {
                axios.post(`${server}/users/login`, {
                    email: 't@y.com',
                    password: '123456',
                }).then(res => {
                    axios.defaults.headers.common['Authorization'] = `${res.data.token}`
                    this.props.navigation.navigate(pageToGoAfterLogin)
                })
            });
        }
    }

    startLoadingAnimation = () => {
        this.intervalAnimation = setInterval(() => {
            let commas = this.state.submitAnimation
            if (commas.length > 4) {
                commas = ''
            }
            this.setState({ ...this.state, submitAnimation: `${commas} .` })
        }, 300);
    }

    signinOrSignup = async () => {
        this.startLoadingAnimation()
        this.setState({ ...this.state, submitting: true })

        if (this.state.stageNew) {
            try {
                await axios.post(`${server}/users/register`, {
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password,
                    passwordConfirm: this.state.passwordConfirm
                })

                Alert.alert('Sucesso!', 'Usuário cadastrado.')
                this.setState({ stageNew: false })
                clearInterval(this.intervalAnimation)
            } catch (err) {
                if (err.response.status === 400) {
                    const jsonString = err.response.data
                    Alert.alert('Dados inválidos.', JSON.stringify(jsonString).replace(/"/g, '').replace(/,/g, '\n\n').replace('{','').replace('}', '').replace(/:/g, ' : '))
                } else {
                    showError(JSON.stringify(err.response))
                }

                this.setState({ ...this.state, submitting: false })
                clearInterval(this.intervalAnimation)
            }
        } else {
            try {
                const res = await axios.post(`${server}/users/login`, {
                    email: this.state.email,
                    password: this.state.password,
                })

                axios.defaults.headers.common['Authorization'] = `${res.data.token}`

                // Alert.alert('Logado com sucesso', `Token: ${axios.defaults.headers.common['Authorization']}`)

                this.props.navigation.navigate(pageToGoAfterLogin)
                clearInterval(this.intervalAnimation)
            } catch (err) {
                if (err.response.status === 400) {
                    const jsonString = err.response.data
                    Alert.alert('Dados inválidos.', JSON.stringify(jsonString).replace(/"/g, '').replace(/,/g, '\n\n').replace('{','').replace('}', '').replace(/:/g, ' : '))
                } else {
                    showError(JSON.stringify(err.response.data.messages))
                    // Alert.alert('Erro!', 'Usuário ou senha incorretos.')
                }

                this.setState({ ...this.state, submitting: false })
                clearInterval(this.intervalAnimation)
            }
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <Text style={styles.welcome}>
                    Museekr
                </Text>
                <Text style={styles.slogan}>
                    {this.state.stageNew ? 'Crie sua conta. É muito fácil!': 'A melhor plataforma para músicos do mundo todo!'}
                </Text>
                <View>
                    {
                        this.state.stageNew && 
                        <TextInput
                            style={styles.input}
                            placeholder='Nome'
                            placeholderTextColor='rgba(255,255,255,0.5)'
                            value={this.state.name}
                            onChangeText={name => this.setState({ name })}
                        />
                    }
                    <TextInput
                        style={styles.input}
                        placeholder='Email'
                        placeholderTextColor='rgba(255,255,255,0.5)'
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Senha'
                        placeholderTextColor='rgba(255,255,255,0.5)'
                        secureTextEntry
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                    />
                    {
                        this.state.stageNew && 
                        <TextInput
                            style={styles.input}
                            placeholder='Confirmação da senha'
                            placeholderTextColor='rgba(255,255,255,0.5)'
                            secureTextEntry
                            value={this.state.passwordConfirm}
                            onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
                        />
                    }
                    <TouchableOpacity
                        onPress={this.signinOrSignup}
                        style={this.state.submitting ? styles.disabledButton : styles.button}
                        disabled={this.state.submitting}>
                        <View>
                            {
                                this.state.stageNew
                                ? 
                                    <Text style={styles.loginSignin}>
                                        {this.state.submitting ? `${this.state.submitAnimation} CADASTRANDO${this.state.submitAnimation}` : `CADASTRAR`}
                                    </Text>
                                :
                                    <Text style={styles.loginSignin}>
                                        {this.state.submitting ? `${this.state.submitAnimation} ENTRANDO${this.state.submitAnimation}` : `ENTRAR`}
                                    </Text>
                            }
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => this.setState({stageNew: !this.state.stageNew})}
                    disabled={this.state.submitting}>
                    <Text style={styles.changeLoginSignin}>
                        {this.state.stageNew ? 'Já possuo conta!' : 'Ainda não tenho conta'}
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#304ffe' // #304ffe #01579b #1a237e #1C2331 #3E4551 #1C2331 #3F729B
    },
    welcome: {
        fontSize: 40,
        textAlign: 'center',
        margin: 10,
        color: '#fff',
    },
    slogan: {
        fontSize: 15,
        textAlign: 'center',
        margin: 20,
        marginTop: 15,
        width: 250,
        marginBottom: 30,
        lineHeight: 22,
        color: '#fff'
    },
    input: {
        height: 40,
        width: 300,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
        color: '#fff',
        paddingHorizontal: 15
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 300,
        backgroundColor: 'rgba(0,0,0,0.3)',
        marginBottom: 15,
        paddingHorizontal: 15
    },
    disabledButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 300,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 15,
        paddingHorizontal: 15
    },
    createAccount: {
        color: '#ccc',
        paddingHorizontal: 15,
        marginBottom: 5
    },
    loginSignin: {
        color: '#eee'
    },
    changeLoginSignin: {
        marginTop: 30,
        color: '#eee'
    },
    img: {
        width: 100, height: 32
    }
});

const pageToGoAfterLogin = 'Profile'