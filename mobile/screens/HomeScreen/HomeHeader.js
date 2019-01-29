import React from 'react'

import {
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo';

export class HomeHeader extends React.Component {
  render() {
    return (
      <LinearGradient
        colors={['#6F86D6', '#48C6EF']}
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 0.5, y: 1.0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.name}>
            Welcome Home, Andrew
          </Text>
          <Image style={styles.avatar}
                 source={require('../../assets/images/avatar.jpeg')}/>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    borderRadius: 20,
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