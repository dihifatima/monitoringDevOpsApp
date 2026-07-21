import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AppText from "@/src/components/common/AppText";
import Colors from "@/src/constants/colors";
import Spacing from "@/src/styles/spacing";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;        
  showBack?: boolean;         
  rightElement?: React.ReactNode; 
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  showBack = true,
  rightElement,
}) => {
  return (
    <View style={styles.header}>
      {showBack ? (
        <Pressable onPress={onBack ?? (() => router.back())} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </Pressable>
      ) : (
        <View style={styles.rightSlot} />
      )}

      <AppText variant="h3" bold style={styles.title}>
        {title}
      </AppText>

      <View style={styles.rightSlot}>{rightElement}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screenPadding,
    padding: Spacing.xl,
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  rightSlot: {
    width: 24,
    alignItems: "flex-end",
  },
});

export default ScreenHeader;