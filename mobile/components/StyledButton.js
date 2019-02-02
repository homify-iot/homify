import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export class StyledButton extends React.Component {
  render() {
    const {
      style,
      onPress,
      disabled,
      children
    } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { ...this.props })
    );
    return (
      <TouchableOpacity
        style={[style, styles.container]}
        disabled={disabled}
        onPress={onPress}>
        {childrenWithProps}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
    padding: 10,
    backgroundColor: 'white',
  }
});
