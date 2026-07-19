import API from "@/src/config/axios";


export interface ExternalConnectionSummary {
  provider: string; // "GITHUB" | "SONARCLOUD" | "JENKINS"
  externalUsername: string;
  connectedAt: string;
  lastSyncAt: string | null;
}

export interface ProfileResponse {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
  profilePicture: string | null;
  jobTitle: string | null;
  company: string | null;
  notificationEnabled: boolean;
  notificationFrequency: string; // "REALTIME" | "DAILY_SUMMARY" | "WEEKLY_SUMMARY"
  onboardingCompleted: boolean;
  createdAt: string;
  externalConnections: ExternalConnectionSummary[];
}

export interface UpdateProfileRequest {
  firstname: string;
  lastname: string;
  jobTitle?: string;
  company?: string;
}

export interface UpdateProfilePictureRequest {
  profilePicture: string; 
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateNotificationsRequest {
  notificationsEnabled: boolean;
  notificationFrequency: string;
}

export interface DeleteAccountRequest {
  password: string;
}


export const clientService = {
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const response = await API.get<ProfileResponse>("/client/profile");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
      throw error;
    }
  },

  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<ProfileResponse> => {
    try {
      const response = await API.put<ProfileResponse>("/client/profile", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      throw error;
    }
  },

  updateProfilePicture: async (
    data: UpdateProfilePictureRequest
  ): Promise<ProfileResponse> => {
    try {
      const response = await API.put<ProfileResponse>(
        "/client/profile/picture",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la photo :", error);
      throw error;
    }
  },

  updatePassword: async (data: UpdatePasswordRequest): Promise<void> => {
    try {
      await API.put("/client/profile/password", data);
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe :", error);
      throw error;
    }
  },

  updateNotifications: async (
    data: UpdateNotificationsRequest
  ): Promise<ProfileResponse> => {
    try {
      const response = await API.put<ProfileResponse>(
        "/client/profile/notifications",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications :", error);
      throw error;
    }
  },

  deleteAccount: async (data: DeleteAccountRequest): Promise<void> => {
    try {
      await API.delete("/client/profile", { data });
    } catch (error) {
      console.error("Erreur lors de la suppression du compte :", error);
      throw error;
    }
  },
};