import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth.schema";
import { useRegisterMutation } from "../api/auth";
import Input from "../components/Input";

export default function RegisterScreen({
  navigation
}: {
  navigation: StackNavigationProp<any>;
}) {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      name: "",
      password: ""
    }
  });

  const { mutate, isPending } = useRegisterMutation();

  const onRegister = form.handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        navigation.navigate("Login");
      }
    });
  });

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text
          variant="headlineMedium"
          style={{
            fontWeight: "700",
            marginBottom: 16
          }}
        >
          Register
        </Text>
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => (
            <Input
              label="Name"
              textContentType="name"
              value={field.value}
              onChangeText={field.onChange}
              error={form.formState.errors.name?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="username"
          render={({ field }) => (
            <Input
              label="username"
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
              error={form.formState.errors.username?.message}
            />
          )}
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
    width: "80%"
  }
});
