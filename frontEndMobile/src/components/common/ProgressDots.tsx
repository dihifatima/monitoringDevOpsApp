// src/components/common/ProgressDots.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "@/src/constants/colors";
import Spacing from "@/src/styles/spacing";

interface ProgressDotsProps {
  totalSteps: number;
  currentStep: number; 
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ totalSteps, currentStep }) => {
  return (
    <View style={styles.row}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === currentStep ? Colors.success : Colors.greyLight,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
});

export default ProgressDots;