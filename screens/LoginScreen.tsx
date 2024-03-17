import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import api from "../lib/api";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../stores/useAuthStore";

const LoginScreen = ({
  navigation
}: {
  navigation: StackNavigationProp<any>;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      return api
        .post<{ accessToken: string }>("/auth/login", data)
        .then((res) => res.data);
    }
  });

  const onLogin = () => {
    mutate(
      { username, password },
      {
        onSuccess: async (data) => {
          await AsyncStorage.setItem("accessToken", data.accessToken);
          login(data.accessToken);
        },
        onError: (error) => {
          console.error(error);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text
          variant="headlineMedium"
          style={{
            fontWeight: "700"
          }}
        >
          Login
        </Text>
        <TextInput
          label="Username"
          textContentType="username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          label="Password"
          textContentType="newPassword"
          secureTextEntry
          passwordRules="required: lower; required: upper; required: digit; minlength: 8;"
        />
        <Button onPress={onLogin} mode="contained" loading={isPending}>
          Login
        </Button>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12
          }}
        >
          <Text>Do not have an account?</Text>
          <Button
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            Register
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  formContainer: {
    width: "80%",
    gap: 16
  }
});

export default LoginScreen;
