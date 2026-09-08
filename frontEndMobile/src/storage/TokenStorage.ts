import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const TokenStorage = {
  saveTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

      // Logs de vérification temporaires — à retirer une fois le flow validé.
      console.log("[TokenStorage] Tokens sauvegardés avec succès");
      console.log("[TokenStorage] accessToken (30 premiers car.) :", accessToken.substring(0, 30) + "...");
      console.log("[TokenStorage] REFRESH TOKEN COMPLET (test uniquement) :", refreshToken);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des tokens:", error);
      throw error;
    }
  },

  getAccessToken: async (): Promise<string | null> => {
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      console.log("[TokenStorage] getAccessToken ->", token ? "présent" : "absent");
      return token;
    } catch (error) {
      console.error("Erreur lors de la lecture de l'access token:", error);
      return null;
    }
  },

  getRefreshToken: async (): Promise<string | null> => {
    try {
      const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      console.log("[TokenStorage] getRefreshToken ->", token ? "présent" : "absent");
      return token;
    } catch (error) {
      console.error("Erreur lors de la lecture du refresh token:", error);
      return null;
    }
  },

  clearTokens: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      console.log("[TokenStorage] Tokens supprimés");
    } catch (error) {
      console.error("Erreur lors de la suppression des tokens:", error);
    }
  },
};