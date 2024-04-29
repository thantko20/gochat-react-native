import { useQuery } from "@tanstack/react-query";
import { pb } from "../lib/pocketbase";
import { ClientResponseError } from "pocketbase";
import { Chat, GetChats } from "../types/chats.types";

export const chatKeys = {
  one: (id: string) => ["chats", id],
  list: (filter?: GetChats) => ["chats", filter]
};

/**
 *
 * @param id - could be either chatId or userId(must be of chat type: normal)
 */
export const useGetChat = (id: string) => {
  return useQuery({
    queryKey: chatKeys.one(id),
    queryFn: () =>
      pb
        .collection("chats")
        .getFirstListItem(
          `(users.id ?= '${id}' && type = 'normal') || id = '${id}'`,
          { expand: "users,lastMessage" }
        ),
    retry(_failureCount, error) {
      return !(error instanceof ClientResponseError && error.status === 404);
    }
  });
};

export const useGetChats = (filter?: GetChats) => {
  const { page = 1, perPage = 20 } = filter || {};
  return useQuery({
    queryKey: chatKeys.list(filter),
    queryFn: () =>
      pb.collection("chats").getList<Chat>(page, perPage, {
        expand: "users,lastMessage"
      })
  });
};
