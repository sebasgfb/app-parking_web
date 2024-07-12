import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';

const PantallaUbicaciones = ({ navigation }) => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerUbicaciones = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/ubicaciones/');
        setUbicaciones(response.data);
        setCargando(false);
      } catch (error) {
        console.error('Error al obtener ubicaciones:', error);
        setCargando(false);
      }
    };

    obtenerUbicaciones();
  }, []);

  const handleVolver = () => {
    navigation.goBack();
  };

  const renderTarjetaUbicacion = ({ item }) => (
    <Pressable style={styles.tarjeta} onPress={() => navigation.navigate('DetallesUbicacion', { ubicacionId: item.id })}>
      <Text style={styles.tituloTarjeta}>{item.nombre}</Text>
    </Pressable>
  );

  if (cargando) {
    return (
      <View style={styles.contenedorCargando}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.barraNavegacion}>
        <Pressable style={styles.volverButton} onPress={handleVolver}>
          <Text style={styles.volverButtonText}>Volver</Text>
        </Pressable>
        <Text style={styles.tituloNavegacion}>Ubicaciones</Text>
      </View>
      <View style={styles.contenido}>
        <Text style={styles.titulo}>Lista de Ubicaciones</Text>
        <FlatList
          data={ubicaciones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTarjetaUbicacion}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  contenedorCargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  tarjeta: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tituloTarjeta: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  volverButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  volverButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PantallaUbicaciones;
