import React from 'react';
import {Dimensions} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from './components/CustomDrawerContent';
import Home from './components/Home';
import {themes} from './utils';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const theme = themes.defaultTheme;

const DrawerRoutes = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {backgroundColor: theme.backgroundColor},
        headerStyle: {
          backgroundColor: theme.backgroundColor,
          height: Dimensions.get('window').width / 7,
        },
        headerTintColor: theme.textColor,
      }}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{title: 'SWIFT CURRENCY CONVERTER'}}
      />
    </Drawer.Navigator>
  );
};

const Pages = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HOME"
        component={DrawerRoutes}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Pages;
