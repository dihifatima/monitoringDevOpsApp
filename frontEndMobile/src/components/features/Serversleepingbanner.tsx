import { useEffect, useState } from "react";
import { ActivityIndicator, DeviceEventEmitter, Modal, StyleSheet, Text, View } from "react-native";
import { checkServerAwake } from "@/src/config/axios";

export default function ServerSleepingBanner() {
  const [visible, setVisible] = useState(false);

  // Écoute des événements envoyés par axios.ts
  useEffect(() => {
    const sleeping = DeviceEventEmitter.addListener("SERVER_SLEEPING", () => setVisible(true));
    const awake = DeviceEventEmitter.addListener("SERVER_AWAKE", () => setVisible(false));
    return () => {
      sleeping.remove();
      awake.remove();
    };
  }, []);

  // Tant que la bannière est visible, on vérifie toutes les 5 secondes
  // si le serveur est réveillé : elle disparaît toute seule.
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      checkServerAwake();
    }, 5000);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#050708" style={styles.loader} />
        <Text style={styles.title}>Serveur indisponible</Text>
        <Text style={styles.message}>
          Nous rétablissons le service, merci de patienter. Cet écran disparaîtra automatiquement.
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loader: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#050708",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: "#5b6068",
    textAlign: "center",
    lineHeight: 20,
  },
});

