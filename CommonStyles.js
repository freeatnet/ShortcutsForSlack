import { StyleSheet } from 'react-native';

// Default button
export var button = StyleSheet.create({
  container: {
    height: 48,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(224, 224, 224)',
    borderRadius: 2,
    elevation: 1
  },
  content: {
    marginRight: 10,
    marginLeft: 10,
    fontSize: 18,
    color: 'rgb(73, 134, 210)'
  }
});

// Primary button
var primaryButtonFlavour = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(73, 134, 210)',
    borderColor: 'rgb(51, 120, 204)'
  },
  content: {
    color: 'white'
  }
});

export var primaryButton = StyleSheet.create({
  container: StyleSheet.flatten([button.container, primaryButtonFlavour.container]),
  content: StyleSheet.flatten([button.content, primaryButtonFlavour.content])
});


// Destructive button
var destructiveButtonFlavour = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(224, 81, 78)',
    borderColor: 'rgb(224, 78, 75)'
  },
  content: {
    color: 'white'
  }
});

export var destructiveButton = StyleSheet.create({
  container: StyleSheet.flatten([button.container, destructiveButtonFlavour.container]),
  content: StyleSheet.flatten([button.content, destructiveButtonFlavour.content])
});
