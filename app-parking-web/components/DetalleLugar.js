import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TextInput, Pressable } from 'react-native';
import axios from 'axios';

const DetalleLugar = ({ route, navigation }) => {
  const { lugarId } = route.params;
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [formData, setFormData] = useState({
    fecha_reserva: '',
    fecha_liberacion: ''
  });

  // Función para obtener reservas
  const obtenerReservas = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/lugares/${lugarId}/reservas/`);
      setReservas(response.data);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerReservas();
  }, []); // Ejecutar solo al montar el componente

  const crearReserva = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/reservas/`, {
        lugar: lugarId,
        fecha_reserva: formData.fecha_reserva,
        fecha_liberacion: formData.fecha_liberacion
      });
      // Actualizar las reservas después de crear una nueva reserva
      obtenerReservas();
      setFormData({
        fecha_reserva: '',
        fecha_liberacion: ''
      }); // Limpiar el formulario después de crear la reserva
    } catch (error) {
      console.error('Error al crear reserva:', error);
    }
  };

  const renderTarjetaReserva = ({ item }) => (
    <View style={styles.tarjeta}>
      <Text style={styles.tituloTarjeta}>Reserva ID: {item.id}</Text>
      <Text style={styles.detalle}>Fecha de Reserva: {item.fecha_reserva}</Text>
      <Text style={styles.detalle}>Fecha de Liberación: {item.fecha_liberacion}</Text>
    </View>
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
        <Text style={styles.tituloNavegacion}>Detalle del Lugar</Text>
      </View>
      <Text style={styles.titulo}>Reservas</Text>
      <TextInput
        style={styles.input}
        placeholder="Fecha de Reserva"
        value={formData.fecha_reserva}
        onChangeText={(text) => setFormData({ ...formData, fecha_reserva: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de Liberación"
        value={formData.fecha_liberacion}
        onChangeText={(text) => setFormData({ ...formData, fecha_liberacion: text })}
      />
      <Pressable style={styles.crearButton} onPress={crearReserva}>
        <Text style={styles.crearButtonText}>Crear Reserva</Text>
      </Pressable>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTarjetaReserva}
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
  detalle: {
    fontSize: 16,
    color: '#777',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  crearButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  crearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetalleLugar;
