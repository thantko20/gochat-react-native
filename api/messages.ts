import { useQuery } from "@tanstack/react-query";
import { pb } from "../lib/pocketbase";
import { User } from "../types/user";
import { Message } from "../types/message";

export const useGetMessages = (query: {
  userOrChatId: string;
  perPage?: number;
  page?: number;
}) => {
  const { userOrChatId, perPage = 20, page = 1 } = query;

  return useQuery({
    queryKey: ["messages", query],
    queryFn: () =>
      pb.collection("messages").getList<Message>(page, perPage, {
        filter: `(chat.users.id ?= '${userOrChatId}' && chat.type = 'normal') || chat.users.id ?= '${userOrChatId}'`,
        expand: "sender"
      })
  });
};
