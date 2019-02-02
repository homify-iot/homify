import React from 'react'

import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { StyledButton } from "../../components/StyledButton";
import SvgUri from "../../components/SvgUri";
import { LinearGradient } from 'expo';

export class Accessory extends React.Component {
  render() {
    const {
      item,
    } = this.props;
    return (
      <StyledButton style={styles.container}>
        <View>
          <SvgUri
            width="24"
            height="24"
            fill={'#1CB5E0'}
            source={item.icon}
          />
          <Text style={styles.accessoryName}>
            {item.name}
          </Text>
        </View>
      </StyledButton>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  accessoryName: {
    paddingTop: 10
  },
});