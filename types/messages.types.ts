import { User } from "./users.type";

export type Message = {
  id: string;
  sender: string;
  body: string;
  expand: { sender: User };
  isSending?: boolean;
  optimisticId?: string;
};
