// app/objective.tsx
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

export default function ObjectiveScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View>
        <ProgressDots totalSteps={4} currentStep={1} />
        <View style={styles.illustrationWrapper}>
          <Illustration source={Images.devopsIllustration} />
        </View>
      </View>

      <View style={styles.textBlock}>
        <AppText variant="h1" bold color={Colors.accent}>
          Décidez en{"\n"}toute confiance
        </AppText>
        <AppText
          variant="small"
          color={Colors.textSecondary}
          style={{ marginTop: Spacing.sm }}
        >
          Notre IA analyse GitHub, Jenkins et SonarQube pour vous dire si votre déploiement est prêt.
        </AppText>
      </View>

      <View style={styles.footer}>
        <AppButton
          label="Retour"
          variant="text"
          onPress={() => router.back()}
        />
        <AppButton
          label="Suivant"
          showArrow
          onPress={() => router.push("/(auth)/welcome")}
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