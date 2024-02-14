// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ShareOption from './ShareOption';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Enjoy with your fav person!</Text>
      
      {/* TouchableOpacity for Chat 1 with pink color */}
      <TouchableOpacity
        style={[styles.button, styles.buttonPink]}
        onPress={() => navigation.navigate('Chat1')}
      >
        <Text style={styles.buttonText}>Meloni</Text>
      </TouchableOpacity>
      
      {/* <TouchableOpacity
        style={[styles.button, styles.buttonBlue]}
        onPress={() => navigation.navigate('Chat2')}
      >
        <Text style={styles.buttonText}>Vicky Kaushal</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.buttonOrange]}
        onPress={() => navigation.navigate('Chat3')}
      >
        <Text style={styles.buttonText}>Bestie</Text>
      </TouchableOpacity> */}
      <ShareOption />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10, // Adds space between buttons
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center', // Ensure text is centered within the button
    width: 200, // Optional: Adjust button width as needed
  },
  buttonText: {
    color: '#fff',
    fontSize: 16, // Optional: Adjust font size as needed
  },
  buttonPink: {
    backgroundColor: 'pink',
  },
  buttonBlue: {
    backgroundColor: 'blue',
  },
  buttonOrange: {
    backgroundColor: 'orange',
  },
});

export default HomeScreen;
