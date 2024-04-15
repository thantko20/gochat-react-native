import { User } from "./users.type";

export type GetChats = {
  page?: number;
  perPage?: number;
};

export type Chat = {
  id: string;
  type: "normal" | "group";
  users: string[];
  created: string;
  updated: string;
  expand: {
    users: User[];
  };
};
