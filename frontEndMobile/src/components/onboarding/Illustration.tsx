// src/components/onboarding/Illustration.tsx
import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType, Dimensions } from "react-native";
import Colors from "@/src/constants/colors";

interface IllustrationProps {
  source: ImageSourcePropType;
}

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.9;

const Illustration: React.FC<IllustrationProps> = ({ source }) => {
  return (
    <View style={styles.circle}>
      <Image source={source} style={styles.image} resizeMode="contain"  />
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: Colors.circleGreen,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  image: {
    width: "90%",
    height: "90%",
  },
});

export default Illustration;