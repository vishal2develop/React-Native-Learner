import React, { useState, useEffect } from "react";
import { Text, View, Image, useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset, useAssets } from "expo-asset";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./navigation/Tabs";
import Stack from "./navigation/Stack";
import Root from "./navigation/Root";
import { darkTheme, lightTheme } from "./theme/styled";
import { ThemeProvider } from "styled-components/native";

const loadFonts = (fonts) =>
  fonts.map(async (font) => await Font.loadAsync(font));

const loadImages = (images) =>
  images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.loadAsync(image);
    }
  });

export default function App() {
  const [ready, setReady] = useState(false);
  const isDark = useColorScheme() === "dark";
  const [assets] = useAssets([
    require("./dreamhouse-logo.png"),
    "https://snack-web-player.s3.us-west-1.amazonaws.com/v2/49/assets/src/react-native-logo.png",
  ]);

  const [fonts] = Font.useFonts(Ionicons.font);

  if (!assets || !fonts) {
    SplashScreen.preventAutoHideAsync();
  } else {
    SplashScreen.hideAsync();
  }

  // return (
  //   <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
  //     <Text>SplashScreen Demo! 👋</Text>
  //   </View>
  // );

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </ThemeProvider>
  );
}
