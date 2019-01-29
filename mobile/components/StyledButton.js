import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import SvgUri from './SvgUri';

export class StyledButton extends React.Component {
  render() {
    const {
      onPress,
      text,
      disabled,
    } = this.props;
    return (
      <TouchableOpacity
        style={styles.container}
        disabled={disabled}
        onPress={onPress}>
        <SvgUri
          width="30"
          height="30"
          source={require('../assets/images/living-room.svg')}
        />
        <Text style={{paddingHorizontal: 10}}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    shadowColor: '#444',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
    padding: 20,
    backgroundColor: 'white',
  }
});
