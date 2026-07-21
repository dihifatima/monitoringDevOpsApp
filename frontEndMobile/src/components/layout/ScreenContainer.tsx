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
  backgroundColor = Colors.green,
  style,
  scrollable = false,
  withTabBar = false,
}) => {
  const tabBarHeight = useTabBarHeight();

  const Wrapper = scrollable ? ScrollView : View;
  const wrapperProps = scrollable
    ? {
        contentContainerStyle: [
          styles.scrollContent,
      
          !footer && withTabBar && { paddingBottom: tabBarHeight + Spacing.lg },
        ],
        showsVerticalScrollIndicator: false,
        keyboardShouldPersistTaps: "handled" as const,
      }
    : {};

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>

      {header}

      <Wrapper style={[styles.content, style]} {...wrapperProps}>
        {children}
      </Wrapper>

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
    paddingHorizontal: Spacing.screenPadding,
    justifyContent: "space-between",
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