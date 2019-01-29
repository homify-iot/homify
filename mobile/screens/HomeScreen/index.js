import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Button
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../../components/StyledText';
import { HomeHeader } from "./HomeHeader";
import { StyledButton } from "../../components/StyledButton";
import { Grid } from "../../components/Grid";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <HomeHeader />
          <View style={{top: -100}}>
            <Grid />
            {this._showRoomList()}
          </View>
        </ScrollView>
      </View>
    );
  }

  _showRoomList() {
    return (
      <View style={styles.horizontalList}>
        <Text style={styles.horizontalListTitle}>Rooms</Text>
        <FlatList
          data={[{title: 'Living room', key: 'item1'},{title: 'Bathroom', key: 'item2'},{title: 'Bedroom', key: 'item3'},{title: 'Master room', key: 'item4'}]}
          horizontal={true}
          renderItem={({item}) => (
            <StyledButton text={item.title}>
            </StyledButton>
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  horizontalList: {
    marginLeft: 20
  },
  horizontalListTitle: {
    fontSize: 18,
    paddingVertical: 6,
    fontWeight: '500'
  }
});
