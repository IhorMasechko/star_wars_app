import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Screens/Home/Home';
import CharacterDetails from '../Screens/CharacterDetails/CharacterDetails';
import Statistics from '../Screens/Statistics/Statistics';

const Stack = createNativeStackNavigator();

const Main: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Home',
            headerStyle: {backgroundColor: 'black'},
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen
          name="CharacterDetails"
          component={CharacterDetails}
          options={{
            title: 'Character Details',
            headerStyle: {backgroundColor: 'black'},
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen
          name="Statistics"
          component={Statistics}
          options={{
            title: 'Statistics',
            headerStyle: {backgroundColor: 'black'},
            headerTintColor: '#FFFFFF',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
