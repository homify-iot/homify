import React from "react";
import {
  TouchableOpacity,
  View,
  Text
} from "react-native";

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
        <View>
          <Text disabled={disabled}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
