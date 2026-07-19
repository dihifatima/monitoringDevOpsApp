import { Ionicons } from '@expo/vector-icons';

export interface TabBarItemConfig {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  isCenter?: boolean;
}

export const tabBarItems: TabBarItemConfig[] = [
  { 
    name: 'home', 
    icon: 'home-outline', 
    activeIcon: 'home', 
    label: 'Accueil' 
  },
  { 
    name: 'Projets', 
    icon: 'git-branch-outline', 
    activeIcon: 'git-branch',   // ← sans -outline = version pleine
    label: 'Projets' 
  },
  { 
    name: 'notifications', 
    icon: 'notifications-outline',
    activeIcon: 'notifications',
    isCenter: true              // ← bouton central flottant
  },
  { 
    name: 'Pipelines', 
    icon: 'git-merge-outline', 
    activeIcon: 'git-merge',    // ← cohérent avec pipelines CI/CD
    label: 'Pipelines' 
  },
  { 
    name: 'plus', 
    icon: 'ellipsis-horizontal-outline', 
    activeIcon: 'ellipsis-horizontal',
    label: 'Plus' 
  },
];