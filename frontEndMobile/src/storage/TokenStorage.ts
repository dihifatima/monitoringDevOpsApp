import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_token';

export const TokenStorage = {
  saveToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du token:", error);
      throw error;
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Erreur lors de la lecture du token:", error);
      return null;
    }
  },

  deleteToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Erreur lors de la suppression du token:", error);
    }
  },
};
