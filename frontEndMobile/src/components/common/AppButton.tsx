import React from "react";
import { TouchableOpacity, ViewStyle, StyleProp, Image, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "./AppText";
import Colors from "@/src/constants/colors";
import Spacing from "@/src/styles/spacing";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "text" | "secondary" | "green";
  showArrow?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconImage?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
}

const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  showArrow = false,
  icon,
  iconImage,
  style,
}) => {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isGreen = variant === "green";

  const backgroundColor = isPrimary
    ? Colors.black
    : isSecondary
    ? Colors.success
    : isGreen
    ? Colors.green
    : "transparent";

  const textColor = isPrimary
    ? Colors.white
    : isSecondary
    ? Colors.accent
    : isGreen
    ? Colors.black
    : Colors.black;

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
          borderWidth: isSecondary || isGreen ? 1 : 0,
          borderColor: isGreen ? Colors.greyLight : Colors.black,
          paddingVertical: Spacing.sm + 4,
          paddingHorizontal: Spacing.lg,
          borderRadius: Spacing.buttonRadius,
        },
        style,
      ]}
    >
      {iconImage && (
        <Image
          source={iconImage}
          style={{ width: 18, height: 18, marginRight: Spacing.xs }}
          resizeMode="contain"
        />
      )}
      {!iconImage && icon && (
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
        <Ionicons name="arrow-forward" size={20} color={Colors.accent} />
      )}
    </TouchableOpacity>
  );
};

export default AppButton;