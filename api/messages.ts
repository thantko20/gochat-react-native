import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { pb } from "../lib/pocketbase";
import { GetMessages, Message } from "../types/messages.types";
import { ListResult, RecordModel } from "pocketbase";

export const messagesKeys = {
  list: (query: GetMessages) => ["messages", query],
  optimisticList: (cached: {}) => ["messages"]
};

export const useGetMessages = (query: GetMessages) => {
  const { userOrChatId, perPage = 20, page = 1 } = query;

  return useInfiniteQuery({
    queryKey: messagesKeys.list(query),
    queryFn: ({ pageParam }) =>
      pb.collection("messages").getList<Message>(pageParam, perPage, {
        filter: `(chat.users.id ?= '${userOrChatId}' && chat.type = 'normal') || chat.users.id ?= '${userOrChatId}' || chat.id = '${userOrChatId}'`,
        expand: "sender",
        sort: "-created"
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (lastPage.page >= lastPage.totalPages) {
        return undefined;
      }

      return lastPage.page + 1;
    },
    select: (inifiniteMessages) => {
      return inifiniteMessages.pages.map((page) => page.items).flat();
    }
  });
};

export const useSendMesssage = (cachedQueryKey: GetMessages) => {
  const queryClient = useQueryClient();
  const key = messagesKeys.list(cachedQueryKey);
  return useMutation({
    mutationFn: async ({
      senderId,
      receiverId,
      message,
      optimisticId = ""
    }: {
      receiverId: string;
      senderId: string;
      message: string;
      optimisticId: string;
    }) => {
      if (!message) return;

      return pb.collection("messages").create(
        {
          receiver: receiverId,
          sender: senderId,
          body: message,
          optimisticId
        },
        {
          expand: "sender"
        }
      );
    },
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: key });

      const prev =
        queryClient.getQueryData<InfiniteData<ListResult<Message>>>(key);
      console.log(prev);

      queryClient.setQueryData<InfiniteData<ListResult<Message>>>(
        key,
        (old) => {
          return {
            pageParams: old?.pageParams || [1],
            pages: old?.pages.map((page) => {
              if (page.page === 1) {
                return {
                  ...page,
                  items: [
                    {
                      ...newMessage,
                      id: Date.now(),
                      body: newMessage.message,
                      sender: newMessage.senderId,
                      isSending: true
                    },
                    ...page.items
                  ]
                };
              }
              return page;
            })
          } as InfiniteData<ListResult<Message>>;
        }
      );

      return { prev };
    },
    onError: (_err, _newMessage, context) => {
      queryClient.setQueryData(key, context?.prev);
    },
    onSuccess: (data) => {
      queryClient.setQueryData<InfiniteData<ListResult<Message>>>(
        key,
        (old) => {
          return {
            pageParams: old?.pageParams || [1],
            pages: old?.pages.map((page) => {
              if (page.page === 1) {
                const tmpItems = page.items;
                const idx = tmpItems.findIndex(
                  (item) => item.optimisticId === data?.optimisticId
                );
                console.log({ data, item: tmpItems[idx] });

                if (idx >= 0) {
                  tmpItems[idx] = data as unknown as Message;
                }
                return {
                  ...page,
                  items: tmpItems
                };
              }
              return page;
            })
          } as InfiniteData<ListResult<Message>>;
        }
      );
    }
  });
};
