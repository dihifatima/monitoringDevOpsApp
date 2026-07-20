import React from "react";
import { TouchableOpacity, ViewStyle, StyleProp } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "./AppText";
import Colors from "@/src/constants/colors";
import Spacing from "@/src/styles/spacing";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "text" | "secondary";
  showArrow?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  showArrow = false,
  icon,
  style,
}) => {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";


  const backgroundColor = isPrimary
    ? Colors.black
    : isSecondary
    ? Colors.green
    : "transparent";

  const textColor = isPrimary ? Colors.white : Colors.black;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor,
          borderWidth: isSecondary ? 1 : 0,
          borderColor: Colors.black,
          paddingVertical: Spacing.sm + 4,
          paddingHorizontal: Spacing.lg,
          borderRadius: Spacing.buttonRadius,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={textColor}
          style={{ marginRight: Spacing.xs }}
        />
      )}
      <AppText
        variant="button"
        bold
        color={textColor}
        style={{ marginRight: showArrow ? Spacing.xs : 0 }}
      >
        {label}
      </AppText>
      {showArrow && (
        <Ionicons name="arrow-forward" size={16} color={Colors.white} />
      )}
    </TouchableOpacity>
  );
};

export default AppButton;