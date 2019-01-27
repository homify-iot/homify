import React from "react";
import {
  TouchableOpacity,
  Text,
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
        disabled={disabled}
        onPress={onPress}>
        <Text disabled={disabled} style={{color: 'red'}}>
          {text}
        </Text>
        <SvgUri
          width="50"
          height="50"
          fill="yellow"
          source={require('../assets/images/living-room.svg')}
        />
      </TouchableOpacity>
    );
  }
}
