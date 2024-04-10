import "./sse-polyfill";
import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AuthStackNavigator from "./navigation/AuthStackNavigator";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/react-query";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./screens/MainScreen";
import { useEffect } from "react";
import useAuthStore from "./stores/useAuthStore";
import { pb } from "./lib/pocketbase";
import ChatScreen from "./screens/ChatScreen";
import { config } from "@tamagui/config/v3";
import { createTamagui, TamaguiProvider } from "tamagui";
import { themes } from "./styles/theme";
import { useFonts } from "expo-font";

const appConfig = createTamagui({ ...config, themes });

export type AppConfig = typeof appConfig;

declare module "tamagui" {
  // or '@tamagui/core'
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

const Stack = createStackNavigator();

export default function App() {
  const { user, onAuthChange, token } = useAuthStore();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf")
  });

  useEffect(() => {
    return pb.authStore.onChange(onAuthChange);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={appConfig} defaultTheme="light_green">
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Auth">
            {!user ? (
              <Stack.Screen
                name="Auth"
                component={AuthStackNavigator}
                options={{
                  headerShown: false
                }}
              ></Stack.Screen>
            ) : (
              <>
                <Stack.Screen name="Main" component={MainScreen}></Stack.Screen>
                <Stack.Screen
                  name="Chat"
                  component={ChatScreen}
                  options={({ route }) => ({
                    title: (route.params as { name: string })?.name || "Chat"
                  })}
                ></Stack.Screen>
              </>
            )}
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
