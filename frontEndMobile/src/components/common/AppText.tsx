import React from "react";
import { Text, TextStyle, StyleProp, TextProps } from "react-native";
import Typography from "@/src/styles/typography";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Variant = keyof typeof Typography;

// On étend les propriétés standards de TextProps pour récupérer onPress, numberOfLines, etc.
interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  bold?: boolean;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const AppText: React.FC<AppTextProps> = ({
  variant = "body",
  color = Colors.black,
  bold = false,
  style,
  children,
  onPress, // On récupère onPress ici
  ...rest  // On récupère toutes les autres options natives de Text
}) => {
  return (
    <Text
      onPress={onPress} // On le transmet au composant Text de React Native
      style={[
        {
          fontSize: Typography[variant],
          color,
          fontFamily: bold ? Fonts.bold : Fonts.regular,
        },
        style,
      ]}
      {...rest} // On applique les autres props comme numberOfLines si besoin
    >
      {children}
    </Text>
  );
};

export default AppText;