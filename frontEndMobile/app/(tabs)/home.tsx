import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuthGlobal } from '@/src/context/AuthContext'; // Import de ton état global
import AppText from '@/src/components/common/AppText'; // Remplace par ton composant texte si besoin
import Colors from '@/src/constants/colors';
import Typography from '@/src/styles/typography'
export default function HomeScreen() {
  const { user, loading } = useAuthGlobal(); 
  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText variant="h1" style={styles.mainTitle}>
        Tableau de bord 
      </AppText>
      
      <AppText style={styles.subtitle}>
        welcome  {user?.fullName}
      </AppText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.green,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: Typography.h1,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.small,
    color: Colors.black,
    marginBottom: 24,
  },
   
});