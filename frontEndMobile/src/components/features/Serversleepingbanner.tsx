import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { checkServerAwake, wakeServer } from "@/src/config/axios";

// À remplacer par ton adresse
const SUPPORT_EMAIL = "dihifatima08@gmail.com";

function contactSupport() {
  const subject = encodeURIComponent("Serveur en veille - Monitoring DevOps");
  const body = encodeURIComponent(
    "Bonjour,\n\nLe serveur de l'application est en veille. Pouvez-vous le réveiller ?\n\nMerci."
  );
  return Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`).catch(() => {});
}

export default function ServerSleepingBanner() {
  const [visible, setVisible] = useState(false);
  const [wakeRequested, setWakeRequested] = useState(false);

  // Écoute des événements envoyés par axios.ts
  useEffect(() => {
    const sleeping = DeviceEventEmitter.addListener("SERVER_SLEEPING", () => setVisible(true));
    const awake = DeviceEventEmitter.addListener("SERVER_AWAKE", () => {
      setVisible(false);
      setWakeRequested(false);
    });
    return () => {
      sleeping.remove();
      awake.remove();
    };
  }, []);

  // Tant que l'écran est visible, on vérifie toutes les 5 secondes
  // si le serveur est réveillé : il disparaît tout seul.
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      checkServerAwake();
    }, 5000);
    return () => clearInterval(id);
  }, [visible]);

  const handleWake = async () => {
    setWakeRequested(true);
    try {
      await wakeServer(); // ouvre le navigateur : seul un vrai navigateur réveille le conteneur
    } catch {
      setWakeRequested(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={() => {}}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#050708" style={styles.loader} />
        <Text style={styles.title}>Serveur en veille</Text>
        <Text style={styles.message}>
          {wakeRequested
            ? "Démarrage en cours, cela prend 1 à 2 minutes. Attendez que la page du navigateur indique que c'est prêt, puis revenez ici : cet écran disparaîtra automatiquement."
            : "Le serveur se met en veille après 15 minutes d'inactivité. Appuyez sur « Réveiller » : un navigateur s'ouvre et le démarrage prend 1 à 2 minutes."}
        </Text>

        <Pressable style={styles.primaryBtn} onPress={handleWake} accessibilityRole="button">
          <Text style={styles.primaryText}>
            {wakeRequested ? "Rouvrir la page de réveil" : "Réveiller le serveur"}
          </Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={contactSupport} accessibilityRole="button">
          <Text style={styles.secondaryText}>Contacter le support</Text>
        </Pressable>
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
  loader: { marginBottom: 20 },
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
    marginBottom: 28,
  },
  primaryBtn: {
    backgroundColor: "#050708",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignSelf: "stretch",
    alignItems: "center",
  },
  primaryText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  secondaryBtn: {
    marginTop: 12,
    paddingVertical: 12,
    alignSelf: "stretch",
    alignItems: "center",
  },
  secondaryText: { color: "#050708", fontSize: 14, textDecorationLine: "underline" },
});