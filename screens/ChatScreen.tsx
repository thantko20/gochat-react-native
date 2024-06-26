import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import { messagesKeys, useGetMessages, useSendMesssage } from "../api/messages";
import { GetMessages, Message as TMessage } from "../types/messages.types";
import { pb } from "../lib/pocketbase";
import {
  ClientResponseError,
  ListResult,
  RecordSubscription
} from "pocketbase";
import { useQueryClient } from "@tanstack/react-query";
import { View } from "react-native";
import Input from "../components/Input";
import { MessagesContainer } from "../components/MessagesContainer";
import { Button } from "../components/Button";
import { RootStackScreenProps } from "../types/navigation.types";
import { useLoader } from "../stores/useLoaderStore";
import { IconButton } from "../components/IconButton";
import { Feather } from "@expo/vector-icons";

const ChatScreen = ({ route }: RootStackScreenProps<"Chat">) => {
  const { userId, chatId } = route.params;

  const [message, setMessage] = useState("");

  const { user } = useAuthStore();

  const filters: GetMessages = {
    userOrChatId: chatId || userId,
    currentUserId: user?.id
  };

  const key = messagesKeys.list(filters);

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
      console.log(data.record);
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

  useLoader(isLoading);

  return (
    <View className="flex-1 bg-slate-200">
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
          <IconButton
            onPress={onSend}
            icon={<Feather name="send" size={24} color={"white"} />}
          />
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;
