import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
import { ENV } from "./env"; // Importation de tes variables d'environnement

// 1. INSTANCE PROTÉGÉE (Besoin du Token JWT)
const API = axios.create({
  baseURL: ENV.API_URL, // Nettoyé et dynamique grâce au fichier env.js
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête : Ajout automatique du JWT
API.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("user_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : Gestion automatique des erreurs 401 et 403
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("user_token");
      router.replace("/(auth)/login");
    }
    if (error.response?.status === 403) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)/home");
      }
    }
    return Promise.reject(error);
  }
);

// 2. INSTANCE PUBLIQUE (Login, Register, Activation)
export const PublicAPI = axios.create({
  baseURL: ENV.API_URL, // Nettoyé également !
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;