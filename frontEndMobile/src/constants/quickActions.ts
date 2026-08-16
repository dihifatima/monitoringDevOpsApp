import type { Href } from 'expo-router';

export type QuickActionKey = 'projets' | 'pipelines' | 'connexions' | 'repos' | 'notifications' | 'profil';

export type QuickActionDef = {
  key: QuickActionKey;
  label: string;
  icon: string; // nom Ionicons
  path: Href;
};

export const QUICK_ACTIONS_CATALOG: QuickActionDef[] = [
  { key: 'projets', label: 'Projets', icon: 'folder-outline', path: '/Projets' },
  { key: 'pipelines', label: 'Pipelines', icon: 'git-network-outline', path: '/Pipelines' },
  { key: 'connexions', label: 'Connexions DevOps', icon: 'link-outline', path: '/plus/devops-connections-settings' },
  { key: 'repos', label: 'Repos GitHub', icon: 'logo-github', path: '/plus/github-repos-settings' },
  { key: 'notifications', label: 'Notifications', icon: 'notifications-outline', path: '/notifications' },
  { key: 'profil', label: 'Profil', icon: 'person-outline', path: '/plus/profile-settings' },
];

export const DEFAULT_QUICK_ACTIONS: QuickActionKey[] = ['projets', 'pipelines', 'notifications'];