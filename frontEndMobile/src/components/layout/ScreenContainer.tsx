import React from "react";
import { View, ViewStyle, StyleProp, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/src/constants/colors";
import Spacing from "@/src/styles/spacing";
import { useTabBarHeight } from "@/src/context/TabBarHeightContext";

interface ScreenContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  withTabBar?: boolean;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  header,
  footer,
  backgroundColor = Colors.whiteLight,
  style,
  scrollable = false,
  withTabBar = false,
}) => {
  const tabBarHeight = useTabBarHeight();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      {header}

      {scrollable ? (
        <ScrollView
          style={styles.scrollWrapper}
          contentContainerStyle={[
            styles.scrollContent,
            style,
            !footer && withTabBar && { paddingBottom: tabBarHeight + Spacing.lg },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, style]}>{children}</View>
      )}

      {footer && (
        <View
          style={[
            styles.footer,
            withTabBar && { paddingBottom: tabBarHeight + Spacing.md },
          ]}
        >
          {footer}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.s,
    justifyContent: "space-between",
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
  },
  footer: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.screenPadding,
  },
});

export default ScreenContainer;