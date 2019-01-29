import React from 'react'

import {
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';

export class HomeHeader extends React.Component {
  render() {
    return (
      <ImageBackground
        source={require('../../assets/images/bedroom.jpeg')}
        style={{width: '100%', height: 200}}
      >
        <View style={styles.headerContent}>
          <Image style={styles.avatar}
                 source={require('../../assets/images/avatar.jpeg')}/>
          <Text style={styles.name}>
            Welcome Home, Andrew
          </Text>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 40
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 30,
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
});