import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from './ChatScreen';
import HomeScreen from './HomeScreen'; 
import { SafeAreaView } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat1" component={ChatScreen} options={{ title: 'Chat with Meloni' }} initialParams={{ chatPersonId: 'meloni' }} />
          <Stack.Screen name="Chat2" component={ChatScreen} options={{ title: 'Chat with Vicky Kaushal' }} initialParams={{ chatPersonId: 'vickey' }} />
          <Stack.Screen name="Chat3" component={ChatScreen} options={{ title: 'Chat with Bestie' }} initialParams={{ chatPersonId: 'bestie' }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    // Assuming you want the ShareButton at the bottom and centered
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Position absolutely in relation to the screen
    left: 0,
    right: 0,
    bottom: 0, // Adjust according to needs
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
