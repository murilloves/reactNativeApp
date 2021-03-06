import React from 'react'
import {} from 'react-native'
import { StyleSheet, Text, View } from 'react-native'

import FooterNavigationComponent from '../components/FooterNavigation'
import HeaderComponent from '../components/Header';

export default class HomePage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <HeaderComponent title="Home" navigation={this.props.navigation} navTo='Playlists' />
        <Text style={styles.welcome}>Página Inicial</Text>
        <FooterNavigationComponent navigation={this.props.navigation} currentPage='HomePage' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffbb33',
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  }
});
