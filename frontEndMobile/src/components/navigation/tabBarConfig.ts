import { Ionicons } from '@expo/vector-icons';

export interface TabBarItemConfig {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
  label?: string;
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
    activeIcon: 'git-branch',   
    label: 'Projets' 
  },
  { 
    name: 'notifications', 
    icon: 'notifications-outline',
    activeIcon: 'notifications',
  },
  { 
    name: 'Pipelines', 
    icon: 'git-merge-outline', 
    activeIcon: 'git-merge',    
    label: 'Pipelines' ,

  },
  { 
    name: 'plus', 
    icon: 'ellipsis-horizontal-outline', 
    activeIcon: 'ellipsis-horizontal',
    label: 'Plus' 
  },
];