import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { PaperProvider, Text } from "react-native-paper";
import AuthStackNavigator from "./navigation/AuthStackNavigator";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/react-query";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./screens/MainScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import useAuthStore from "./stores/useAuthStore";

const Stack = createStackNavigator();

export default function App() {
  const [isRetrievingToken, setIsRetrievingToken] = useState(true);

  const { isSignedIn, setAuthState } = useAuthStore();

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const t = await AsyncStorage.getItem("accessToken");
        setAuthState(t);
      } finally {
        setIsRetrievingToken(false);
      }
    };

    retrieveToken();
  }, []);

  if (isRetrievingToken) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Getting token</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Auth">
            {!isSignedIn ? (
              <Stack.Screen
                name="Auth"
                component={AuthStackNavigator}
                options={{
                  headerShown: false
                }}
              ></Stack.Screen>
            ) : (
              <Stack.Screen name="Main" component={MainScreen}></Stack.Screen>
            )}
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
