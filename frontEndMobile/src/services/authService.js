import API, { PublicAPI } from "@/src/config/axios";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";

export const authService = {
  
  
  register: async (userData) => {
    try {
      const response = await PublicAPI.post("/auth/register", {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: userData.password,
        
        // Champs exigés par ton RegistrationRequest DTO
        client: true,
        admin: false
    
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      throw error;
    }
  },


  activateAccount: async (token) => {
    try {
      const response = await PublicAPI.get(`/auth/activate-account?token=${token}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'activation :", error);
      throw error;
    }
  },

 
  login: async (email, password) => {
    try {
      // Ajusté pour correspondre à ton @PostMapping("/login") du contrôleur
      const response = await PublicAPI.post("/auth/login", { email, password });
      
      // Récupération du token depuis la Map JSON retournée par Spring Boot
      if (response.data && response.data.token) {
        await SecureStore.setItemAsync("user_token", response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      throw error;
    }
  },

  
  logout: async () => {
    try {
      // Appel à ton @PostMapping("/logout")
      await API.post("/auth/logout");
    } catch (e) {
      console.log("Logout côté backend (non bloquant) :", e.message);
    } finally {
      // Nettoyage impératif du stockage local du smartphone
      await SecureStore.deleteItemAsync("user_token");
      // Redirection immédiate vers l'écran de Login
      router.replace("/(auth)/login");
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await API.get("/auth/me"); // instance protégée, token ajouté automatiquement
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
      throw error;
    }
  }
};