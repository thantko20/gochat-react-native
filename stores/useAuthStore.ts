import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { pb } from "../lib/pocketbase";
import { AuthModel } from "pocketbase";
import { User } from "../types/user";

type AuthStoreState = {
  user: User | null;
  token: string | null;
  isLoadingAuth: boolean;
  onAuthChange: (token: string, model: AuthModel) => void;
};

const useAuthStore = create<AuthStoreState>((set) => ({
  user: pb.authStore.model as User,
  token: pb.authStore.token,
  isLoadingAuth: true,
  onAuthChange: (token, model) => set(() => ({ token, user: model as User }))
}));

export default useAuthStore;
