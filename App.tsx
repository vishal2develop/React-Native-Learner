import React, { useState, useEffect } from "react";
import { Image, useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset, useAssets } from "expo-asset";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Root from "./navigation/Root";
import { darkTheme, lightTheme } from "./theme/styled";
import { ThemeProvider } from "styled-components/native";

const queryClient = new QueryClient();

const loadFonts = (
  fonts:
    | string[]
    | {
        [fontFamily: string]: Font.FontSource;
      }[]
) => fonts.map(async (font) => await Font.loadAsync(font));

const loadFonts2 = (
  fonts:
    | string[]
    | {
        [fontFamily: string]: Font.FontSource;
      }[]
) => fonts.map((font) => Font.loadAsync(font));

const loadImages = (images: string[] | number[] | string[][] | number[][]) =>
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <NavigationContainer>
          <Root />
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
