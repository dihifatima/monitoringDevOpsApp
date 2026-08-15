import AppButton from "@/src/components/common/AppButton";
import AppText from "@/src/components/common/AppText";
import ProgressDots from "@/src/components/common/ProgressDots";
import ScreenContainer from "@/src/components/layout/ScreenContainer";
import Illustration from "@/src/components/onboarding/Illustration";
import Colors from "@/src/constants/colors";
import Images from "@/src/constants/images";
import { useAuthGlobal } from "@/src/context/AuthContext";
import Spacing from "@/src/styles/spacing";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

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
        <AppText variant="h1" bold color={Colors.black} style={styles.title}>
          Toute votre chaîne DevOps réunie
        </AppText>
        <AppText variant="small" color={Colors.grey} style={styles.subtitle}>
          Analyse, décide et déploie en toute confiance
        </AppText>
      </View>

      <View style={styles.footer}>
        <AppButton label="Skip" variant="text" onPress={handleSkip} />
        <AppButton
          label="Suivant"
          variant="secondary"
          showArrow
          onPress={() => router.push("/objective")}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  illustrationWrapper: {
    marginTop: Spacing.xxl,
    padding: Spacing.md,
    alignItems: "center",
  },
  textBlock: {
    marginBottom: Spacing.s,
    alignItems: "center",
    paddingHorizontal: Spacing.s,
  },
  title: {
    textAlign: "center",
    lineHeight: 50,
  },
  subtitle: {
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
});