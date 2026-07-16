import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_token';

export const TokenStorage = {
 saveToken: async (token: string): Promise<void> => {
  console.log("💾 SAVE - token à écrire, longueur:", token.length);
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  const verif = await SecureStore.getItemAsync(TOKEN_KEY);
  console.log("✅ SAVE - vérif immédiate après écriture:", verif ? `présent (${verif.length} car.)` : "❌ ABSENT !!!");
},

getToken: async (): Promise<string | null> => {
  const t = await SecureStore.getItemAsync(TOKEN_KEY);
  console.log("📖 GET - lecture token:", t ? `présent (${t.length} car.)` : "absent");
  return t;
},

 
  deleteToken: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};