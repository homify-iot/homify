import React from 'react'

import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { StyledButton } from "../../components/StyledButton";
import SvgUri from "../../components/SvgUri";
import { LinearGradient } from 'expo';

export class Room extends React.Component {
  render() {
    const {
      name,
    } = this.props;
    return (
      <StyledButton style={{ marginRight: 10}}>
        <View style={styles.container}>
          <LinearGradient colors={['#000046', '#1CB5E0']} start={[0.5, 0.1]} style={styles.roundedIcon}>
            <SvgUri
              width="30"
              height="30"
              fill={'white'}
              source={require('../../assets/images/room/living-room.svg')}
            />
          </LinearGradient>
          <View style={styles.roomInfo}>
            <Text style={styles.roomName}>
              {name}
            </Text>
            <View style={styles.roomStatusContainer}>
              <View style={styles.roomStatus}>
                <SvgUri
                  width="16"
                  height="16"
                  fill={'#1CB5E0'}
                  source={require('../../assets/images/room/thermometer.svg')}
                />
                <Text>24&#8451;</Text>
              </View>
              <View style={styles.roomStatus}>
                <SvgUri
                  width="16"
                  height="16"
                  fill={'#1CB5E0'}
                  source={require('../../assets/images/room/humidity.svg')}
                />
                <Text>69%</Text>
              </View>
            </View>
          </View>
        </View>
      </StyledButton>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundedIcon: {
    padding: 8,
    alignItems:'center',
    borderRadius:100,
  },
  roomInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 10
  },
  roomName: {
    fontSize: 18,
    paddingBottom: 10
  },
  roomStatusContainer: {
    flexDirection: 'row'
  },
  roomStatus: {
    flexDirection: 'row',
    paddingRight: 6
  }
});