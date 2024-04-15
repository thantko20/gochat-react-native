import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import { useGetMessages, useSendMesssage } from "../api/messages";
import { Message as TMessage } from "../types/messages.types";
import { pb } from "../lib/pocketbase";
import {
  ClientResponseError,
  ListResult,
  RecordSubscription
} from "pocketbase";
import { useQueryClient } from "@tanstack/react-query";
import { View, Button } from "react-native";
import Input from "../components/Input";
import { MessagesContainer } from "../components/MessagesContainer";

const ChatScreen = ({ route, navigation }: any) => {
  const { userId, chatId } = route.params;

  const [message, setMessage] = useState("");

  const { user } = useAuthStore();

  const filters = {
    userOrChatId: chatId || userId,
    currentUserId: user?.id
  };

  const key = ["message", filters];

  const {
    data: messages,
    isLoading,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useGetMessages(filters);

  const { mutateAsync } = useSendMesssage(filters);

  const queryClient = useQueryClient();

  useEffect(() => {
    const subscriptionHandler = (data: RecordSubscription<TMessage>) => {
      if (data.record.sender !== user?.id) {
        const exist = queryClient.getQueryData(key);
        if (!exist) {
          refetch();
          return;
        }
        queryClient.setQueryData(key, (old: ListResult<TMessage>) => {
          return {
            ...old,
            items: [data.record, ...old?.items]
          };
        });
      }
    };

    const initSubscription = async () => {
      try {
        console.log("Connecting to event source");
        await pb.collection("messages").subscribe("*", subscriptionHandler);
        console.log("Real time subscription has been initialized");
      } catch (reason) {
        if (reason instanceof ClientResponseError) {
          console.log("Realtime error: ", reason.toJSON());
        }
      }
    };

    initSubscription();

    return () => {
      (async () => {
        await pb.collection("messages").unsubscribe("*");
        console.log("Unsubscribed");
      })();
    };
  }, []);

  const onSend = async () => {
    if (!message) return;

    await mutateAsync({
      message,
      receiverId: userId,
      senderId: user!.id,
      optimisticId: Date.now().toString()
    });
    setMessage("");
  };

  return (
    <View className="flex-1">
      <MessagesContainer
        messages={messages || []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingMore={isFetchingNextPage}
        isLoadingChat={isLoading}
      />
      <View className="flex-row bg-white flex-shrink-0 p-2">
        <View className="flex-1">
          <Input
            placeholder="say hi!"
            value={message}
            onChangeText={setMessage}
          />
        </View>
        <View className="flex-shrink-0 ml-2">
          <Button onPress={onSend} title="Send" />
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;
