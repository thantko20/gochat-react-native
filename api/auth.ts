import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { pb } from "../lib/pocketbase";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      return pb
        .collection("users")
        .authWithPassword(data.username, data.password);
    }
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: async (data: {
      username: string;
      name: string;
      password: string;
    }) => {
      return pb
        .collection("users")
        .create({ ...data, passwordConfirm: data.password });
    }
  });
