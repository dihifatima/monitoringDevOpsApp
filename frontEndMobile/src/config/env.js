import { Platform } from "react-native";

export const ENV = {
  // Sélectionne automatiquement la bonne URL selon la plateforme (Android ou iOS)
  API_URL: __DEV__
    ? (Platform.OS === "android" 
        ? process.env.EXPO_PUBLIC_API_URL_ANDROID 
        : process.env.EXPO_PUBLIC_API_URL_IOS)
    : (process.env.EXPO_PUBLIC_API_URL_PROD || "https://api.skinecare99.com/api/v1"),
    
  // Tu pourras ajouter d'autres variables globales ici plus tard
  // ex: GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID

};
  console.log("API_URL utilisée:", ENV.API_URL);