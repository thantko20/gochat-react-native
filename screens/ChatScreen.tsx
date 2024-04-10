import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import { useGetMessages, useSendMesssage } from "../api/messages";
import { Button, Input, Text, View, XStack, YStack } from "tamagui";
import { Message as TMessage } from "../types/message";
import { User } from "../types/user";
import { pb } from "../lib/pocketbase";
import {
  ClientResponseError,
  ListResult,
  RecordModel,
  RecordSubscription
} from "pocketbase";
import { useQueryClient } from "@tanstack/react-query";

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
      padding="$2"
      bg="$green4Light"
      borderRadius="$4"
      width="50%"
      alignSelf={user?.id === message.sender ? "flex-end" : "flex-start"}
      opacity={message.isSending ? 0.7 : 1}
    >
      <Text>{message.body}</Text>
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

  const { data: messages, isLoading, refetch } = useGetMessages(filters);

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
      senderId: user!.id
    });
    setMessage("");
  };

  return (
    <View flex={1}>
      {isLoading ? <Text>Loading Chat!</Text> : null}
      <YStack
        flex={1}
        flexDirection="column-reverse"
        paddingHorizontal="$2"
        paddingVertical="$2"
        gap="$2"
      >
        {messages?.items.map((message) => (
          <Message key={message.id} message={message} user={user} />
        ))}
      </YStack>
      <XStack gap={12} padding="$4" bg="white">
        <Input
          flex={1}
          placeholder="say hi!"
          value={message}
          onChangeText={setMessage}
        />
        <Button onPress={onSend}>Send</Button>
      </XStack>
    </View>
  );
};

export default ChatScreen;
