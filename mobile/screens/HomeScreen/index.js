import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

import { HomeHeader } from "./HomeHeader";
import { StyledButton } from "../../components/StyledButton";
import { Grid } from "../../components/Grid";
import { Room } from "./Room";

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
            {this._showRecentDevices()}
          </View>
        </ScrollView>
      </View>
    );
  }

  _showRoomList() {
    return (
      <View style={[styles.horizontalList, { marginRight: 0 }]}>
        <Text style={styles.horizontalListTitle}>Rooms</Text>
        <FlatList
          data={[{title: 'Living room', key: 'item1'},{title: 'Bathroom', key: 'item2'},{title: 'Bedroom', key: 'item3'},{title: 'Master room', key: 'item4'}]}
          horizontal={true}
          renderItem={({item}) => (
            <Room name={item.title}/>
          )}
        />
      </View>
    )
  }

  _showRecentDevices() {
    return (
      <View style={styles.horizontalList}>
        <Text style={styles.horizontalListTitle}>Recently used devices</Text>
        <FlatList
          data={[
            { id: "00", name: "Relâmpago McQueen" },
            { id: "01", name: "Agente Tom Mate" },
            { id: "02", name: "Doc Hudson" },
            { id: "03", name: "Cruz Ramirez" }
          ]}
          numColumns={2}
          renderItem={({item}) => (
            <StyledButton text={item.name} />
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
    marginHorizontal: 20,
    marginBottom: 16
  },
  horizontalListTitle: {
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 10
  },
  item: {
    alignItems: "center",
    backgroundColor: "#dcda48",
    flex: 1,
    margin: 4,
    padding: 20
  },
  text: {
    color: "#333333"
  }
});
