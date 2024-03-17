import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import useAuthStore from "../stores/useAuthStore";
import { StackNavigationProp } from "@react-navigation/stack";

const MainScreen = ({
  navigation
}: {
  navigation: StackNavigationProp<any>;
}) => {
  const { logout } = useAuthStore();
  return (
    <View>
      <Button
        onPress={async () => {
          logout();
          await AsyncStorage.removeItem("accessToken");
          navigation.navigate("Auth", { screen: "Login" });
        }}
        mode="contained-tonal"
      >
        Log Out
      </Button>
    </View>
  );
};

export default MainScreen;
