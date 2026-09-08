import axios from "axios";
import { DeviceEventEmitter } from "react-native";
import { TokenStorage } from "@/src/storage/TokenStorage";
import { ENV } from "./env";

// INSTANCE PROTÉGÉE (Besoin de l'access token)
const API = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// INSTANCE PUBLIQUE (Login, Register, Activation, Refresh)
export const PublicAPI = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête : ajout automatique de l'access token
API.interceptors.request.use(
  async (config) => {
    const accessToken = await TokenStorage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Pendant qu'un refresh est en cours, toute requête qui échoue aussi en 401
 * est mise en attente ici plutôt que de déclencher SON PROPRE appel /refresh
 * (qui invaliderait le refresh token en cours de rotation - un seul refresh
 * à la fois doit réussir, cf. la logique de rotation côté backend).
 */
let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

function resolvePendingRequests(newAccessToken: string | null) {
  pendingRequests.forEach((callback) => callback(newAccessToken));
  pendingRequests = [];
}

async function performTokenRefresh(): Promise<string | null> {
  const refreshToken = await TokenStorage.getRefreshToken();
  if (!refreshToken) {
    console.log("[Axios/Refresh] Aucun refresh token disponible, abandon");
    return null;
  }

  console.log("[Axios/Refresh] Appel de /auth/refresh en cours...");

  // Appel brut, sans passer par authService, pour éviter une dépendance
  // circulaire (authService importe ce fichier axios.js).
  const response = await axios.post(`${ENV.API_URL}/auth/refresh`, { refreshToken });
  const { accessToken, refreshToken: newRefreshToken } = response.data;

  console.log("[Axios/Refresh] Nouveau couple de tokens reçu avec succès");
  await TokenStorage.saveTokens(accessToken, newRefreshToken);
  return accessToken;
}

/**
 * Prévient l'AuthContext (en dehors de l'arbre React ici) qu'il faut déconnecter
 * l'utilisateur et le renvoyer au login - typiquement quand le refresh token
 * lui-même est invalide, expiré, ou révoqué (rejeu détecté côté serveur).
 * On distingue la raison pour adapter le message affiché à l'utilisateur.
 */
function emitForceLogout(reason: "token_reuse" | "session_expired") {
  DeviceEventEmitter.emit("FORCE_LOGOUT", { reason });
}

// Intercepteur de réponse : renouvellement automatique sur 401, puis rejeu de la requête
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    console.log("[Axios/Refresh] 401 reçu sur", originalRequest.url, "- déclenchement du refresh");

    if (isRefreshing) {
      console.log("[Axios/Refresh] Un refresh est déjà en cours, mise en file d'attente");
      // Un refresh est déjà en cours : on attend son résultat plutôt que
      // d'en déclencher un second en parallèle.
      return new Promise((resolve, reject) => {
        pendingRequests.push((newAccessToken) => {
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(API(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newAccessToken = await performTokenRefresh();

      if (!newAccessToken) {
        console.log("[Axios/Refresh] Échec du refresh (pas de token) - déconnexion");
        await TokenStorage.clearTokens();
        resolvePendingRequests(null);
        emitForceLogout("session_expired");
        return Promise.reject(error);
      }

      console.log("[Axios/Refresh] Refresh réussi, rejeu de la requête initiale :", originalRequest.url);
      resolvePendingRequests(newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return API(originalRequest);
    } catch (refreshError: any) {
      // Refresh token invalide, expiré, ou déjà révoqué (rejeu détecté) :
      // impossible de continuer la session, on nettoie tout et on force
      // le retour à l'écran de login, avec un message adapté à la cause.
      console.log("[Axios/Refresh] Le refresh token est invalide/expiré/révoqué - déconnexion", refreshError?.response?.data);
      await TokenStorage.clearTokens();
      resolvePendingRequests(null);

      const businessErrorCode = refreshError?.response?.data?.businessErrorCode;
      const reason = businessErrorCode === 308 ? "token_reuse" : "session_expired";
      emitForceLogout(reason);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default API;