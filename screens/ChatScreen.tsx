import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import { useGetMessages, useSendMesssage } from "../api/messages";
import { Message as TMessage } from "../types/message";
import { User } from "../types/user";
import { pb } from "../lib/pocketbase";
import {
  ClientResponseError,
  ListResult,
  RecordSubscription
} from "pocketbase";
import { useQueryClient } from "@tanstack/react-query";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import Input from "../components/Input";
import clsx from "clsx";

const Message = ({
  message,
  user
}: {
  message: TMessage;
  user: User | null;
}) => {
  return (
    <View
      key={message.id}
      className={clsx(
        "p-2 rounded-md w-[49%]",
        user?.id === message.sender
          ? "self-end bg-blue-500"
          : "self-start bg-neutral-400",
        message.isSending && "bg-blue-300"
      )}
    >
      <Text className="text-white">{message.body}</Text>
    </View>
  );
};

const ChatScreen = ({ route, navigation }: any) => {
  const { userId } = route.params;

  const [message, setMessage] = useState("");

  const { user } = useAuthStore();

  const filters = {
    userOrChatId: userId,
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
      console.log(data.action);
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

  return (
    <View className="flex-1">
      {isLoading ? <Text>Loading Chat!</Text> : null}
      {isFetchingNextPage ? <Text>Fetching next page!</Text> : null}
      <FlatList
        inverted
        className="flex-1 px-2"
        contentContainerStyle={{
          gap: 10
          // flex: 1
        }}
        data={messages || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Message message={item} user={user} />}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
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
