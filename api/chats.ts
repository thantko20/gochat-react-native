import { useQuery } from "@tanstack/react-query";
import { pb } from "../lib/pocketbase";
import { ClientResponseError } from "pocketbase";

/**
 *
 * @param id - could be either chatId or userId(must be of chat type: normal)
 */
export const useGetChat = (id: string) => {
  return useQuery({
    queryKey: ["chats", id],
    queryFn: () =>
      pb
        .collection("chats")
        .getFirstListItem(
          `(users.id ?= '${id}' && type = 'normal') || id = '${id}'`,
          { expand: "users" }
        ),
    retry(failureCount, error) {
      return !(error instanceof ClientResponseError && error.status === 404);
    }
  });
};
