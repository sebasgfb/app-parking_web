import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PantallaInicioSesion from './components/PantallaInicioSesion';
import PantallaInicio from './components/PantallaInicio';
import PantallaUbicaciones from './components/PantallaUbicaciones';

const Stack = createStackNavigator();

export default function Aplicacion() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InicioSesion">
        <Stack.Screen name="InicioSesion" component={PantallaInicioSesion} options={{ headerShown: false }} />
        <Stack.Screen name="Inicio" component={PantallaInicio} options={{ headerShown: false }} />
        <Stack.Screen name="Ubicaciones" component={PantallaUbicaciones} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
