import { create } from "zustand";

const useAuthStore = create<{
  isSignedIn: boolean;
  token: string | null;
  login: (token: string) => void;
  setAuthState: (token: string | null) => void;
  logout: () => void;
}>((set) => ({
  isSignedIn: false,
  token: null,
  setAuthState: (token: string | null) =>
    set(() => ({ token, isSignedIn: Boolean(token) })),
  login: (token: string) => set(() => ({ isSignedIn: true, token })),
  logout: () => set(() => ({ isSignedIn: false, token: null }))
}));

export default useAuthStore;
