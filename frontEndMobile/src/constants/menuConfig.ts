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
    id: 'profile-settings',
    title: 'Infos & réglages',
    subtitle: 'Édition profil & mot de passe',
    icon: 'person-outline',
    route: '/plus/profile-settings',
  },
  {
    id: 'devops-connections',
    title: 'Connexions DevOps',
    subtitle: 'GitHub, SonarCloud, Jenkins',
    icon: 'git-network-outline',
    route: '/plus/devops-connections',
  },
  {
    id: 'github-repos',
    title: 'Repos GitHub suivis',
    subtitle: 'Liste + sélection des repos',
    icon: 'logo-github',
    route: '/plus/github-repos',
  },
];