import "./sse-polyfill";
import "react-native-gesture-handler";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AuthStackNavigator from "./navigation/AuthStackNavigator";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/react-query";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./screens/MainScreen";
import { useEffect, useMemo } from "react";
import useAuthStore from "./stores/useAuthStore";
import { pb } from "./lib/pocketbase";
import ChatScreen from "./screens/ChatScreen";
import { Text, View } from "react-native";
import { RootStackParamList } from "./types/navigation.types";
import { useLoaderStore } from "./stores/useLoaderStore";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { useFonts } from "expo-font";

const RootStack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter: require("./assets/fonts/Inter-Black.otf")
  });

  const defaultTheme = useMemo(
    () => ({
      ...DefaultTheme,
      fonts: {
        regular: {
          fontFamily: fontsLoaded ? "Inter" : "System"
        },
        medium: {
          fontFamily: fontsLoaded ? "Inter" : "System"
        },
        bold: {
          fontFamily: fontsLoaded ? "Inter" : "System"
        },
        heavy: {
          fontFamily: fontsLoaded ? "Inter" : "System"
        }
      }
    }),
    [fontsLoaded]
  );
  const { user, onAuthChange } = useAuthStore();

  const { isLoading } = useLoaderStore();

  useEffect(() => {
    return pb.authStore.onChange(onAuthChange);
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      console.log("fonts loaded");
    }
  }, [fontsLoaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <LoadingOverlay loading={isLoading} />
      <NavigationContainer theme={defaultTheme}>
        <RootStack.Navigator
          initialRouteName="Auth"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#3b82f6"
            },
            headerTitleStyle: {
              color: "white"
            },
            headerTintColor: "white"
          }}
        >
          {!user ? (
            <RootStack.Screen
              name="Auth"
              component={AuthStackNavigator}
              options={{
                headerShown: false
              }}
            ></RootStack.Screen>
          ) : (
            <>
              <RootStack.Screen
                name="Main"
                component={MainScreen}
              ></RootStack.Screen>
              <RootStack.Screen
                name="Chat"
                component={ChatScreen}
                options={({ route }) => ({
                  title: route.params?.name || "Chat"
                })}
              ></RootStack.Screen>
            </>
          )}
        </RootStack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
