import { useEffect } from "react";
import { create } from "zustand";

export const useLoaderStore = create<{
  isLoading: boolean;
  set: (value: boolean) => void;
}>((set) => ({
  isLoading: false,
  set: (value) => set({ isLoading: value })
}));

export const useLoader = (loading: boolean) => {
  const { set } = useLoaderStore();
  useEffect(() => {
    set(loading);
  }, [loading]);
};
