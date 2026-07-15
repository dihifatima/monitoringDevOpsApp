// src/components/onboarding/TopIconsRow.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Spacing from "@/src/styles/spacing";

const TopIconsRow: React.FC = () => {
  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        <Ionicons name="flash" size={18} color={Colors.white} />
      </View>
      <View style={styles.iconCircle}>
        <Ionicons name="card-outline" size={18} color={Colors.white} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.lg,
    marginTop: Spacing.lg,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TopIconsRow;