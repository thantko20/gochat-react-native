import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      return api
        .post<{ accessToken: string }>("/auth/login", data)
        .then((res) => res.data);
    }
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: async (data: {
      username: string;
      name: string;
      password: string;
    }) => {
      return api.post("/auth/register", data).then((res) => res.data);
    }
  });
