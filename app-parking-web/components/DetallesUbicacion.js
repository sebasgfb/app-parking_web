import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable } from 'react-native';
import axios from 'axios';

const DetallesUbicacion = ({ route, navigation }) => {
  const { ubicacionId } = route.params;
  const [lugares, setLugares] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerLugares = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/ubicaciones/${ubicacionId}/lugares/`);
          setLugares(response.data);
          setCargando(false);
        } catch (error) {
          console.error('Error al obtener detalles de lugares:', error);
          setCargando(false);
        }
      };

    obtenerLugares();
  }, [ubicacionId]);

  const renderTarjetaLugar = ({ item }) => (
    <Pressable onPress={() => navigation.navigate('DetalleLugar', { lugarId: item.id })}>
      <View style={styles.tarjeta}>
        <Text style={styles.tituloTarjeta}>{item.numero}</Text>
        <Text style={styles.estado}>{item.estado}</Text>
      </View>
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
        <Pressable style={styles.volverButton} onPress={() => navigation.goBack()}>
          <Text style={styles.volverButtonText}>Volver</Text>
        </Pressable>
        <Text style={styles.tituloNavegacion}>Lugares</Text>
      </View>
      <Text style={styles.titulo}>Lugares de la Ubicación</Text>
      <Text style={styles.subtitulo}>Seleccione algún lugar para ver las reservas o realizar alguna.</Text>
      <FlatList
        data={lugares}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTarjetaLugar}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  subtitulo: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
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
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
  estado: {
    fontSize: 16,
    color: '#777',
  },
});

export default DetallesUbicacion;
