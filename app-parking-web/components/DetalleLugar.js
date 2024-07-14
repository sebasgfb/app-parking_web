import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DetalleLugar = ({ route, navigation }) => {
  const { lugarId } = route.params;
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [formData, setFormData] = useState({
    fecha_reserva: new Date(),
    fecha_liberacion: new Date(),
  });
  const [showReservaPicker, setShowReservaPicker] = useState(false);
  const [showLiberacionPicker, setShowLiberacionPicker] = useState(false);
  const [error, setError] = useState(null);

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
  }, []);

  const validarFechas = () => {
    const now = new Date();
    if (formData.fecha_reserva < now || formData.fecha_liberacion < now) {
      setError('No se puede reservar en el pasado o en la hora actual.');
      return false;
    }
    if (formData.fecha_reserva >= formData.fecha_liberacion) {
      setError('La fecha de liberación debe ser posterior a la fecha de reserva.');
      return false;
    }
    for (let reserva of reservas) {
      const reservaInicio = new Date(reserva.fecha_reserva);
      const reservaFin = new Date(reserva.fecha_liberacion);
      if (
        (formData.fecha_reserva < reservaFin && formData.fecha_liberacion > reservaInicio)
      ) {
        setError('Ya existe una reserva en el intervalo de fechas seleccionadas.');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const crearReserva = async () => {
    if (!validarFechas()) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado.');
        return;
      }

      const headers = {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post('http://127.0.0.1:8000/api/crear_reserva/', {
        fecha_reserva: formData.fecha_reserva.toISOString(),
        fecha_liberacion: formData.fecha_liberacion.toISOString(),
        lugar: lugarId
      }, { headers });

      console.log('Reserva creada:', response.data);
      obtenerReservas();
    } catch (error) {
      console.error('Error al crear reserva:', error);
    }
  };

  const renderTarjetaReserva = ({ item }) => (
    <View style={styles.tarjeta}>
      <Text style={styles.tituloTarjeta}>Reserva ID: {item.id}</Text>
      <Text style={styles.detalle}>Fecha de Reserva: {new Date(item.fecha_reserva).toLocaleString()}</Text>
      <Text style={styles.detalle}>Fecha de Liberación: {new Date(item.fecha_liberacion).toLocaleString()}</Text>
      <Text style={styles.detalle}>Cliente: {item.cliente}</Text>
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

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Pressable onPress={() => setShowReservaPicker(true)} style={styles.input}>
        <Text>{formData.fecha_reserva.toLocaleString()}</Text>
      </Pressable>
      {showReservaPicker && (
        Platform.OS === 'web' ? (
          <DatePicker
            selected={formData.fecha_reserva}
            onChange={(date) => {
              setShowReservaPicker(false);
              if (date) {
                setFormData({ ...formData, fecha_reserva: date });
              }
            }}
            showTimeSelect
            dateFormat="Pp"
            timeIntervals={15}
            inline
          />
        ) : (
          <DateTimePicker
            value={formData.fecha_reserva}
            mode="datetime"
            display="default"
            onChange={(event, date) => {
              setShowReservaPicker(false);
              if (date) {
                setFormData({ ...formData, fecha_reserva: date });
              }
            }}
          />
        )
      )}

      <Pressable onPress={() => setShowLiberacionPicker(true)} style={styles.input}>
        <Text>{formData.fecha_liberacion.toLocaleString()}</Text>
      </Pressable>
      {showLiberacionPicker && (
        Platform.OS === 'web' ? (
          <DatePicker
            selected={formData.fecha_liberacion}
            onChange={(date) => {
              setShowLiberacionPicker(false);
              if (date) {
                setFormData({ ...formData, fecha_liberacion: date });
              }
            }}
            showTimeSelect
            timeIntervals={15}
            dateFormat="Pp"
            inline
          />
        ) : (
          <DateTimePicker
            value={formData.fecha_liberacion}
            mode="datetime"
            display="default"
            onChange={(event, date) => {
              setShowLiberacionPicker(false);
              if (date) {
                setFormData({ ...formData, fecha_liberacion: date });
              }
            }}
          />
        )
      )}

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
    justifyContent: 'center',
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default DetalleLugar;
