import React from 'react'

import {
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native';

export class HomeHeader extends React.Component {
  render() {
    return (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.name}>
            Welcome Home, Andrew
          </Text>
          <Image style={styles.avatar}
                 source={require('../../assets/images/avatar.jpeg')}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#6779e3",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50

  },
  headerContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 30,
    alignItems: 'center'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
});