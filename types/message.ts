import { User } from "./user";

export type Message = {
  id: string;
  sender: string;
  body: string;
  expand: { sender: User };
};
