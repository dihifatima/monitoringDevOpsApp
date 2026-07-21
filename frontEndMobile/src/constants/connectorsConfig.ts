// src/constants/connectorsConfig.ts
import type { Ionicons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import Colors from '@/src/constants/colors';
import Images from '@/src/constants/images';

export type ConnectorKey = 'github' | 'sonarcloud' | 'jenkins';

export type ConnectorStatus = 'CONNECTED' | 'NOT_CONNECTED';

export type ConnectorConfig = {
  id: ConnectorKey;
  title: string;
  // Texte affiché quand le connecteur n'est PAS connecté (ex: "Quality gate monitoring").
  // Quand il EST connecté, ConnectorsList affiche plutôt "@username" renvoyé par le backend.
  description: string;
  // GitHub a un glyphe officiel dans Ionicons, pas SonarCloud/Jenkins → on gère les deux cas.
  icon?: keyof typeof Ionicons.glyphMap;
  iconImage?: ImageSourcePropType;
  iconBgColor: string;
  // Route vers laquelle naviguer au tap, que le connecteur soit connecté ou non.
  // L'écran de destination décide lui-même quoi afficher selon le statut.
  // null = pas encore implémenté côté backend/app → le tap n'a aucun effet pour l'instant.
  route: string | null;
};

export const connectorsConfig: ConnectorConfig[] = [
  {
    id: 'github',
    title: 'GitHub',
    description: 'Historique des commits et repos',
    icon: 'logo-github',
    iconBgColor: Colors.greyLight,
    route: '/plus/github-repos-settings',
  },
  {
    id: 'sonarcloud',
    title: 'SonarCloud',
    description: 'Quality gate monitoring',
    iconImage: Images.sonarcloudLogo,
    iconBgColor: Colors.orangeLight ?? '#FCE9D8',
    // TODO: brancher quand l'écran + le backend SonarCloud existeront
    route: null,
  },
  {
    id: 'jenkins',
    title: 'Jenkins',
    description: 'CI/CD pipelines',
    iconImage: Images.jenkinsLogo,
    iconBgColor: Colors.blueLight ?? '#DCEBFB',
    // TODO: brancher quand l'écran + le backend Jenkins existeront
    route: null,
  },
];