import { View, StyleSheet, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth.schema";
import { useEffect } from "react";
import Input from "../components/Input";
import { useLoginMutation } from "../api/auth";
import { Button } from "../components/Button";
import { useLoader } from "../stores/useLoaderStore";

const LoginScreen = ({
  navigation
}: {
  navigation: StackNavigationProp<any>;
}) => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const { mutate, isPending } = useLoginMutation();

  const onLogin = form.handleSubmit((data) => {
    mutate(data, {
      onError: (error) => {
        console.error(error);
      }
    });
  });

  useEffect(() => {
    form.clearErrors();
  }, [form.clearErrors]);

  useLoader(isPending);

  return (
    <View className="flex-1 justify-center items-center px-12">
      <Text className="self-start mb-10 text-3xl font-bold">GoChat ✨</Text>
      <Text className="self-start mb-8 text-2xl font-bold">
        Login to Continue
      </Text>
      <View className="gap-2">
        <Controller
          control={form.control}
          name="username"
          render={({ field }) => (
            <Input
              label="Username"
              textContentType="username"
              value={field.value}
              onChangeText={field.onChange}
              error={form.formState.errors.username?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              label="Password"
              textContentType="newPassword"
              secureTextEntry
              passwordRules="required: lower; required: upper; required: digit; minlength: 8;"
              error={form.formState.errors.password?.message}
            />
          )}
        />
        <Button onPress={onLogin} disabled={isPending}>
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
            variant="ghost"
          >
            Register
          </Button>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
