import AsyncStorage from "@react-native-async-storage/async-storage";
import PocketBase, { AsyncAuthStore, BaseAuthStore } from "pocketbase";

const store = new AsyncAuthStore({
  save: async (serialized) => AsyncStorage.setItem("pb_auth", serialized),
  initial: AsyncStorage.getItem("pb_auth")
});

export const pb = new PocketBase(process.env.EXPO_PUBLIC_PB_BASE_URL);
