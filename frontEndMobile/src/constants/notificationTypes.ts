import { Ionicons } from '@expo/vector-icons';
import Colors from '@/src/constants/colors';

// ⚠️ Adapte ces clés aux valeurs exactes de ton enum Java NotificationType
export type NotificationSourceType = 'COMMIT' | 'JENKINS_BUILD' | 'SONAR_ANALYSIS';

interface NotificationTypeConfig {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationSourceType, NotificationTypeConfig> = {
  COMMIT: { label: 'GitHub', icon: 'logo-github', color: Colors.black },
  JENKINS_BUILD: { label: 'Jenkins', icon: 'construct-outline', color: '#D24939' },
  SONAR_ANALYSIS: { label: 'Sonar', icon: 'shield-checkmark-outline', color: '#4E9BCD' },
};

export const NOTIFICATION_FILTERS: { key: 'ALL' | NotificationSourceType; label: string }[] = [
  { key: 'ALL', label: 'Tout' },
  { key: 'COMMIT', label: 'GitHub' },
  { key: 'JENKINS_BUILD', label: 'Jenkins' },
  { key: 'SONAR_ANALYSIS', label: 'Sonar' },
];