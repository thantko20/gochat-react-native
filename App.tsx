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
import { Text, View } from "react-native";
import { RootStackParamList } from "./types/navigation.types";
import { useLoaderStore } from "./stores/useLoaderStore";
import { LoadingOverlay } from "./components/LoadingOverlay";

const RootStack = createStackNavigator<RootStackParamList>();

export default function App() {
  const { user, onAuthChange } = useAuthStore();

  const { isLoading } = useLoaderStore();

  useEffect(() => {
    return pb.authStore.onChange(onAuthChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LoadingOverlay loading={isLoading} />
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Auth">
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
                options={() => ({
                  headerRight: () => <Text>Hi</Text>
                })}
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
