import React from "react";
import { View, ViewStyle, StyleProp, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/src/constants/colors";
import Spacing from "@/src/styles/spacing";

interface ScreenContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  backgroundColor = Colors.green,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
    justifyContent: "space-between",
  },
});

export default ScreenContainer;