import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import api from "../lib/api";
import { StackNavigationProp } from "@react-navigation/stack";

export default function RegisterScreen({
  navigation
}: {
  navigation: StackNavigationProp<any>;
}) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: {
      username: string;
      name: string;
      password: string;
    }) => {
      return api.post("/auth/register", data).then((res) => res.data);
    }
  });

  const onRegister = () => {
    mutate(
      { name, username, password },
      {
        onSuccess: () => {
          navigation.navigate("Login");
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
          Register
        </Text>
        <TextInput
          label="Name"
          textContentType="name"
          value={name}
          onChangeText={setName}
        />
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
        <Button onPress={onRegister} mode="contained" loading={isPending}>
          Register
        </Button>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12
          }}
        >
          <Text>Already have an account?</Text>
          <Button
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            Sign In
          </Button>
        </View>
      </View>
    </View>
  );
}

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
