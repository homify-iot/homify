import React from "react";
import {
  Text,
  StyleSheet,
  View,
} from "react-native";

export class Grid extends React.Component {
  render() {
    return (
      <View style={styles.gridContainer}>
        <View style={[styles.gridItem, {borderBottomWidth: StyleSheet.hairlineWidth}]}>
          <Text style={styles.itemValue}>24C</Text>
          <Text style={styles.itemTitle}>avg house temp</Text>
        </View>
        <View style={[styles.gridItem, {borderLeftWidth: StyleSheet.hairlineWidth}]}>
          <Text style={styles.itemValue}>69%</Text>
          <Text style={styles.itemTitle}>humidity</Text>
        </View>
        <View style={[styles.gridItem, {borderRightWidth: StyleSheet.hairlineWidth}]}>
          <Text style={styles.itemValue}>36C</Text>
          <Text style={styles.itemTitle}>outside temp</Text>
        </View>
        <View style={[styles.gridItem, {borderTopWidth: StyleSheet.hairlineWidth}]}>
          <Text style={styles.itemValue}>8</Text>
          <Text style={styles.itemTitle}>devices on</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gridContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    top: -100,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#444',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  gridItem: {
    width: '50%',
    borderColor: '#bbb',
    alignItems: 'center',
    padding: 16
  },
  itemValue: {
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 36
  },
  itemTitle: {
    color: 'rgba(0,0,0,0.4)'
  }
});
