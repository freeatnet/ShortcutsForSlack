/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  NativeModules,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import Button from 'react-native-button';

class ShortcutsForSlack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shortcutName: "",
      shortcutLink: ""
    }
  }

  _onFieldChangeText(field, value) {
    console.log("Field", field, "changed its value to", value);
    var stateUpdate = {};
    stateUpdate[field] = value;
    this.setState(stateUpdate);
  }

  _createShortcut() {
    console.log("Creating with", {shortcutName, shortcutLink} = this.state);

    NativeModules.ShortcutsAndroid.show(this.state.shortcutName, this.state.shortcutLink);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Add a shortcut
        </Text>
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
          <Button onPress={() => this._createShortcut()}>
            CREATE
          </Button>
        </View>
      </View>
    );
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
