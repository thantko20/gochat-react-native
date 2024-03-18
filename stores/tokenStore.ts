import { create } from "zustand";

const tokenStore = create<{
  token: string | null;
  set: (token: string) => void;
}>((set) => {
  return {
    token: null,
    set: (token: string) => set({ token })
  };
});

export default tokenStore;
