import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PantallaInicioSesion = ({ navigation }) => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleInicioSesion = async () => {
    setCargando(true);
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: usuario,
        password: contrasena,
      });
      setCargando(false);
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        navigation.navigate("Inicio");
      } else {
        setError(
          "Error al iniciar sesión. Por favor, verifica tus credenciales."
        );
      }
    } catch (err) {
      setCargando(false);
      setError(
        "Error al iniciar sesión. Por favor, verifica tus credenciales."
      );
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Sistema para Reservas de Estacionamiento</Text>
      <Image
        source={require("../assets/icon.png")} // Ruta de la imagen que deseas mostrar
        style={styles.imagen}
      />
      <Text style={styles.subtitulo}>
        Ingrese sus credenciales para iniciar sesión:
      </Text>
      <TextInput
        style={styles.entrada}
        placeholder="Nombre de usuario"
        value={usuario}
        onChangeText={setUsuario}
      />
      <TextInput
        style={styles.entrada}
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {cargando ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Pressable style={styles.boton} onPress={handleInicioSesion}>
          <Text style={styles.textoBoton}>Iniciar Sesión</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  imagen: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    color: "#666",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  entrada: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  boton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});

export default PantallaInicioSesion;
