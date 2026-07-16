import axios from "axios";
import { TokenStorage } from "@/src/storage/TokenStorage"; // 1. On utilise ton TokenStorage !
import { ENV } from "./env"; 

// INSTANCE PROTÉGÉE (Besoin du Token JWT)
const API = axios.create({
  baseURL: ENV.API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête : Ajout automatique du JWT
API.interceptors.request.use(
  async (config) => {
    // 2. Récupération propre via ton nouveau TokenStorage
    const token = await TokenStorage.getToken(); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : Nettoyage propre sans conflit de navigation
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Si le token est invalide/expiré, on le supprime localement
      await TokenStorage.deleteToken(); 
      // Note : Ne force pas le "router.replace" ici. 
      // Ton AuthContext va détecter la perte de session et rediriger proprement !
    }
    return Promise.reject(error);
  }
);

// INSTANCE PUBLIQUE (Login, Register, Activation)
export const PublicAPI = axios.create({
  baseURL: ENV.API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;