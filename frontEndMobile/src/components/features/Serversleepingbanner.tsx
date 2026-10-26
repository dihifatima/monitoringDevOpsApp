import { useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Adaptez ce chemin à l'emplacement réel de votre fichier axios.ts
import { checkServerAwake, wakeServer } from "@/src/config/axios";

export default function ServerSleepingBanner() {
  const insets = useSafeAreaInsets();
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

  if (!visible) return null;

  return (
    <View style={[styles.banner, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.text}>
        Le serveur est en veille. Le réveil prend environ 1 minute.
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => wakeServer()}>
          <Text style={styles.action}>Réveiller le serveur</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Text style={styles.action}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#FFF3E0",
  },
  text: {
    color: "#5D4037",
  },
  actions: {
    flexDirection: "row",
    gap: 24,
    marginTop: 6,
  },
  action: {
    fontWeight: "bold",
    color: "#E65100",
  },
});