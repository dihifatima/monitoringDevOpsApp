import API, { PublicAPI } from "@/src/config/axios";

export interface UserData {
  firstname?: string;
  lastname?: string;
  email: string;
  password?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
  profilePicture: string | null;
}

export interface LoginResponse {
  token: string;
  roles: string[];
  fullName: string;
}

export const authService = {
  register: async (userData: UserData): Promise<any> => {
    try {
      const response = await PublicAPI.post("/auth/register", {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: userData.password,
        client: true,
        admin: false
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      throw error;
    }
  },

  activateAccount: async (token: string): Promise<any> => {
    try {
      const response = await PublicAPI.get(`/auth/activate-account?token=${token}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'activation :", error);
      throw error;
    }
  },

 login: async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await PublicAPI.post<LoginResponse>("/auth/login", { email, password });
    console.log("STATUS:", response.status);
    console.log("DATA:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.log("ERREUR STATUS:", error.response?.status);
    console.log("ERREUR DATA:", JSON.stringify(error.response?.data, null, 2));
    console.log("ERREUR MESSAGE:", error.message);
    throw error;
  }
},



  logout: async (): Promise<void> => {
    try {
      await API.post("/auth/logout");
    } catch (e: any) {
      console.warn("Logout côté backend (non bloquant) :", e.message);
    }
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    try {
      const response = await API.get<UserResponse>("/auth/me");
      return response.data; 
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
      throw error;
    }
  },
  googleLogin: async (idToken: string): Promise<LoginResponse> => {
  try {
    const response = await PublicAPI.post<LoginResponse>("/auth/google", { idToken });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion Google :", error);
    throw error;
  }
},
forgotPassword: async (email: string): Promise<any> => {
  try {
    const response = await PublicAPI.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation :", error);
    throw error;
  }
},

resetPassword: async (token: string, newPassword: string): Promise<any> => {
  try {
    const response = await PublicAPI.post("/auth/reset-password", { token, newPassword });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la réinitialisation :", error);
    throw error;
  }
},
};

