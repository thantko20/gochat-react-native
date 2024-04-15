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
import { Text } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  const { user, onAuthChange } = useAuthStore();

  useEffect(() => {
    return pb.authStore.onChange(onAuthChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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
              <Stack.Screen
                name="Main"
                component={MainScreen}
                options={() => ({
                  headerRight: () => <Text>Hi</Text>
                })}
              ></Stack.Screen>
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
    </QueryClientProvider>
  );
}
