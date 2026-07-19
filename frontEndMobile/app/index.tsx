import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "@/src/components/common/ScreenContainer";
import AppText from "@/src/components/common/AppText";
import AppButton from "@/src/components/common/AppButton";
import ProgressDots from "@/src/components/common/ProgressDots";
import Illustration from "@/src/components/onboarding/Illustration";
import Images from "@/src/constants/images";
import Spacing from "@/src/styles/spacing";
import Colors from "@/src/constants/colors";
import { useAuthGlobal } from "@/src/context/AuthContext"; 

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuthGlobal(); 

  const handleSkip = () => {
    if (user) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(auth)/login");
    }
  };

  return (
    <ScreenContainer>
      <View>
        <ProgressDots totalSteps={4} currentStep={0} />
        <View style={styles.illustrationWrapper}>
          <Illustration source={Images.devopsIllustration} />
        </View>
      </View>

      <View style={styles.textBlock}>
        <AppText variant="h1" bold color={Colors.accent}>
          DevOps Insights{"\n"}Made for{"\n"}Smart Teams
        </AppText>
        <AppText
          variant="small"
          color={Colors.textSecondary}
          style={{ marginTop: Spacing.sm }}
        >
          Analyse, décide et déploie en toute confiance
        </AppText>
      </View>

      <View style={styles.footer}>
        <AppButton
          label="Skip"
          variant="text"
          onPress={handleSkip} // 👈 changed
        />
        <AppButton
          label="Suivant"
          showArrow
          onPress={() => router.push("/objective")}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  illustrationWrapper: {
    marginTop: Spacing.xl,
  },
  textBlock: {
    marginBottom: Spacing.lg,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
});