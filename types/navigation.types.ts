import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

export type AuthStackParamList = {
  Register: undefined;
  Login: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Chat: { name?: string; userId: string; chatId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
