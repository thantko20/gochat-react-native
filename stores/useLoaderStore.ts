import { useEffect } from "react";
import { create } from "zustand";

export const useLoaderStore = create<{
  isLoading: boolean;
  text: string | null;
  set: (value: boolean, text?: string) => void;
}>((set) => ({
  isLoading: false,
  set: (value, text) => set({ isLoading: value, text: text || null }),
  text: null
}));

export const useLoader = (loading: boolean, text?: string) => {
  const { set } = useLoaderStore();
  useEffect(() => {
    set(loading, text);
  }, [loading]);
};
