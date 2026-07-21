// src/constants/menuConfig.ts
import type { Ionicons } from '@expo/vector-icons';

export type MenuItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

export const moreMenuItems: MenuItem[] = [
  {
    id: 'profile',
    title: 'Profile',
    subtitle: 'Édition profil ',
    icon: 'person-outline',
    route: '/plus/profile-settings',
  },
  {
    id: 'devops-connections',
    title: 'Connexions DevOps',
    subtitle: 'GitHub, SonarCloud, Jenkins',
    icon: 'git-network-outline',
    route: '/plus/devops-connections-settings',
  },
  {
    id: 'github-repos',
    title: 'Repos GitHub suivis',
    subtitle: 'Liste + sélection des repos',
    icon: 'logo-github',
    route: '/plus/github-repos-settings',
  },
  {
    id: 'Notification',
    title: 'Notification',
    subtitle: 'Notification',
    icon: 'logo-github',
    route: '/plus/notifications-settings',
  },
  
  {
    id: 'password',
    title: 'password',
    subtitle: 'password',
    icon: 'logo-github',
    route: '/plus/password-settings',
  },
];