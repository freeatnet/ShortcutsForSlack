/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  NativeModules,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import Button from 'react-native-button';
import RNFS from 'react-native-fs';

import * as CommonStyles from './CommonStyles';

const DummyTokens = [
  // {team_id: "TEAM_ID", token: "API_TOKEN"},
];

class ShortcutsForSlack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      shortcutName: "My Slack",
      shortcutLink: "slack://open"
    }
  }

  componentDidMount() {
    setTimeout(() => {
      DummyTokens.forEach((authentication) => this._onTokenReceived(authentication));
    }, 0);
  }

  _onTokenReceived(authentication) {
    console.log("Authentication received:", authentication);

    this.setState(function (previousState, currentProps) {
      if (previousState.selectedTeamID == null) {
        return { selectedTeamID: DummyTokens[0].team_id };
      }
    }, () => this._updateShortcut());

    fetch('https://slack.com/api/team.info?token=' + authentication.token).then((response) => {
      if (response.ok) {
        response.json().then((responseJSON) => {
          if (responseJSON.ok) {
            let teamData = responseJSON.team;

            var stateUpdate = {};
            stateUpdate["team:" + authentication.team_id + ":info"] = teamData;

            this.setState(stateUpdate);

            RNFS.downloadFile({
              fromUrl: teamData.icon.image_132,
              toFile: [RNFS.DocumentDirectoryPath, teamData.id].join("/")
            });
          } else {
            console.warn("team.info request for", authentication.team_id, "failed: API returned 'ok'", responseJSON.ok);
          }
        });
      } else {
        console.warn("team.info request for", authentication.team_id, "failed:", response.status, resopnse.statusText);
      }

    }, (errorDescription) => console.warn(errorDescription));

    fetch('https://slack.com/api/channels.list?token=' + authentication.token + '&exclude_archived=1').then((response) => {
      if (response.ok) {
        response.json().then((responseJSON) => {
          if (responseJSON.ok) {
            var stateUpdate = {};
            stateUpdate["team:" + authentication.team_id + ":channels"] = responseJSON.channels;

            this.setState(stateUpdate);
          } else {
            console.warn("channels.list request for", authentication.team_id, "failed: API returned 'ok'", responseJSON.ok);
          }
        });
      } else {
        console.warn("channels.list request for", authentication.team_id, "failed:", response.status, resopnse.statusText);
      }
    }, (errorDescription) => console.warn(errorDescription));
  }

  _onFieldChangeText(field, value) {
    console.log("Field", field, "changed its value to", value);
    var stateUpdate = {};
    stateUpdate[field] = value;
    this.setState(stateUpdate);
  }

  _onTeamChanged(value) {
    this.setState({
      selectedTeamID: value,
      selectedChannelID: null
    }, () => this._updateShortcut())
  }

  _onChannelChanged(value) {
    this.setState({
      selectedChannelID: value
    }, () => this._updateShortcut())
  }

  _updateShortcut() {
    let {selectedTeamID, selectedChannelID}  = this.state;
    if (selectedTeamID && !selectedChannelID) {
      if (!this.state["team:" + selectedTeamID + ":info"]) {
        return;
      }

      let shortcutName = "#" + this.state["team:" + selectedTeamID + ":info"].name;
      let shortcutLink = "slack://open?team=" + selectedTeamID;
      this.setState({ shortcutName, shortcutLink });
    } else if (selectedTeamID && selectedChannelID) {
      if (!this.state["team:" + selectedTeamID + ":info"] || !this.state["team:" + selectedTeamID + ":channels"]) {
        return;
      }

      let shortcutName = "#" + this.state["team:" + selectedTeamID + ":channels"]
        .find((channel) => channel.id == selectedChannelID)
        .name;
      let shortcutLink = "slack://channel?" +
        [
          "team=" + selectedTeamID,
          "id=" + selectedChannelID
        ].join('&');

      this.setState({ shortcutName, shortcutLink });
    } else {
      console.warn("Trying to set shortcut, but no team is selected.");
    }
  }

  _createShortcut() {
    console.log("Creating with", {shortcutName, shortcutLink} = this.state);

    let selectedTeamData = this.state["team:" + this.state.selectedTeamID + ":info"];
    NativeModules.ShortcutsAndroid.install(
      this.state.shortcutName,
      this.state.shortcutLink,
      [RNFS.DocumentDirectoryPath, selectedTeamData.id].join("/")
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Add a shortcut
        </Text>
        <View>
          <Text style={styles.inputLabel}>Choose team</Text>
          <Picker
            ref="teamSelector"
            style={styles.picker}
            selectedValue={this.state.selectedTeamID}
            onValueChange={this._onTeamChanged.bind(this)}
            mode="dropdown">
            {
              DummyTokens
                .map((authentication) => this.state["team:" + authentication.team_id + ":info"])
                .filter((info) => info != undefined)
                .map((info) => (<Picker.Item key={info.id} label={info.name} value={info.id} />))
            }
            </Picker>
        </View>
        <View>
          <Text style={styles.inputLabel}>Choose channel</Text>
          <Picker
            ref="channelSelector"
            style={styles.picker}
            selectedValue={this.state.selectedChannelID}
            onValueChange={this._onChannelChanged.bind(this)}
            mode="dropdown">
            {this._renderChannelPickerItems()}
            </Picker>
        </View>
        <View>
          <TouchableWithoutFeedback onPress={() => this.refs.shortcutName.focus()}>
            <View>
              <Text style={styles.inputLabel}>Shortcut name</Text>
            </View>
          </TouchableWithoutFeedback>
          <TextInput
            ref="shortcutName"
            onChangeText={(value) => this._onFieldChangeText("shortcutName", value)}
            value={this.state.shortcutName}
            returnKeyType="next"
            />
        </View>
        <View>
          <TouchableWithoutFeedback onPress={() => this.refs.shortcutLink.focus()}>
            <View>
              <Text style={styles.inputLabel}>Shortcut link</Text>
            </View>
          </TouchableWithoutFeedback>
          <TextInput
            ref="shortcutLink"
            onChangeText={(value) => this._onFieldChangeText("shortcutLink", value)}
            value={this.state.shortcutLink}
            returnKeyType="go"
            />
        </View>
        <View>
          <Button
            containerStyle={CommonStyles.primaryButton.container}
            onPress={() => this._createShortcut()}
            style={CommonStyles.primaryButton.content}>
            ADD TO HOME SCREEN
          </Button>
        </View>
      </View>
    );
  }

  _renderChannelPickerItems() {
    var channels = ((!!this.state.selectedTeamID ? this.state["team:" + this.state.selectedTeamID + ":channels"] : undefined) || []);
    var items = channels
      .filter((channel) => channel.name != "general")
      .map((channel) => (<Picker.Item key={channel.id} label={"#" + channel.name} value={channel.id} />));

    let generalChannel = channels.find(function(channel) {
      return channel.name == "general";
    });
    if (generalChannel) {
      items.unshift((<Picker.Item key="general" label="#general" value={generalChannel.id} />));
    }

    items.unshift((<Picker.Item key="null-channel" label="Last opened" value={null} />));
    return items;
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10
  },
  header: {
    fontSize: 32,
    color: 'rgb(73, 134, 210)'
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "300",
    color: 'rgb(73, 134, 210)',
    marginTop: 8
  },
});

AppRegistry.registerComponent('ShortcutsForSlack', () => ShortcutsForSlack);
