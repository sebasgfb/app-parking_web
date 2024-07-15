import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const PantallaInicio = ({ navigation }) => {
  const handleCerrarSesion = async () => {
    const token = await AsyncStorage.getItem('token');
    await axios.post('http://127.0.0.1:8000/api/logout/', {}, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
    await AsyncStorage.removeItem('token');
    navigation.navigate('InicioSesion');
  };

  const handleVerUbicaciones = () => {
    navigation.navigate('Ubicaciones');
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.barraNavegacion}>
        <Text style={styles.titulo}>Sistema de Parking</Text>
        <Pressable onPress={handleCerrarSesion} style={styles.botonCerrarSesion}>
          <Text style={styles.textoBoton}>Cerrar Sesión</Text>
        </Pressable>
      </View>
      <Card>
      <View style={styles.contenido}>
          <Text style={styles.titulo}>¡Hola!</Text>
          <Text style={styles.subtitulo}>Bienvenido a nuestro Sistema de Reservas de Estacionamiento.</Text>
          <Pressable style={styles.boton} onPress={handleVerUbicaciones}>
            <Text style={styles.textoBoton}>Ver Ubicaciones</Text>
          </Pressable>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  barraNavegacion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloNavegacion: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contenido: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  botonCerrarSesion: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default PantallaInicio;
