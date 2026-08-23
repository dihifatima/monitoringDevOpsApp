import type { Ionicons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import Colors from '@/src/constants/colors';
import Images from '@/src/constants/images';

export type ConnectorKey = 'github' | 'sonarqube' | 'jenkins';

export type ConnectorStatus = 'CONNECTED' | 'NOT_CONNECTED';

export type ConnectorConfig = {
  id: ConnectorKey;
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconImage?: ImageSourcePropType;
  iconBgColor: string;
  route: string | null;
};

export const connectorsConfig: ConnectorConfig[] = [
  {
    id: 'github',
    title: 'GitHub',
    description: 'Historique des commits - repos',
    icon: 'logo-github',
    iconBgColor: Colors.greyLight,
    route: '/plus/github-repos-settings',
  },
  {
    id: 'sonarqube',
    title: 'SonarQube',
    description: 'Quality gate monitoring',
    iconImage: Images.sonarQubeLogo,
    iconBgColor: Colors.greyLight,
    route: null
  },
  {
    id: 'jenkins',
    title: 'Jenkins',
    description: 'CI/CD pipelines',
    iconImage: Images.JenkinsLogo,
    iconBgColor: Colors.greyLight ,
    route: '/Pipelines',
  },
];