import { View, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth.schema";
import { useEffect } from "react";
import Input from "../components/Input";
import { useLoginMutation } from "../api/auth";
import { Button, H2, H3, Heading, Text, YStack } from "tamagui";

const LoginScreen = ({
  navigation
}: {
  navigation: StackNavigationProp<any>;
}) => {
  // const { login } = useAuthStore();

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
      // onSuccess: async (data) => {
      //   login(data.token);
      // },
      onError: (error) => {
        console.error(error);
      }
    });
  });

  useEffect(() => {
    form.clearErrors();
  }, [form.clearErrors]);

  return (
    <View style={styles.container}>
      <YStack gap="$2">
        <H2>Login</H2>
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
        <Button onPress={onLogin} disabled={isPending} marginTop="$4">
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
      </YStack>
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
    gap: 0
  }
});

export default LoginScreen;
