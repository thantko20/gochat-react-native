import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pb } from "../lib/pocketbase";
import { Message } from "../types/message";
import { ListResult } from "pocketbase";

export const useGetMessages = (query: {
  userOrChatId: string;
  currentUserId?: string;
  perPage?: number;
  page?: number;
}) => {
  const { userOrChatId, perPage = 20, page = 1 } = query;

  return useQuery({
    queryKey: ["messages", query],
    queryFn: () =>
      pb.collection("messages").getList<Message>(page, perPage, {
        filter: `(chat.users.id ?= '${userOrChatId}' && chat.type = 'normal') || chat.users.id ?= '${userOrChatId}'`,
        expand: "sender",
        sort: "-created"
      })
  });
};

export const useSendMesssage = (cachedQueryKey: any) => {
  const queryClient = useQueryClient();
  const key = ["messages", cachedQueryKey];
  return useMutation({
    mutationFn: async ({
      senderId,
      receiverId,
      message
    }: {
      receiverId: string;
      senderId: string;
      message: string;
    }) => {
      if (!message) return;

      return pb.collection("messages").create(
        {
          receiver: receiverId,
          sender: senderId,
          body: message
        },
        {
          expand: "sender"
        }
      );
    },
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: key });

      const prev = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (old: ListResult<Message>) => {
        return {
          items: [
            {
              ...newMessage,
              id: Date.now(),
              body: newMessage.message,
              sender: newMessage.senderId,
              isSending: true
            },
            ...old.items
          ]
        };
      });

      return { prev };
    },
    onError: (err, newMessage, context) => {
      console.log({ err });
      queryClient.setQueryData(key, context?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    }
  });
};
