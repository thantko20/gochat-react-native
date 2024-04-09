import React, { useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import { useGetMessages } from "../api/messages";
import { Button, Input, Text, View, XStack, YStack } from "tamagui";
import { Message as TMessage } from "../types/message";
import { User } from "../types/user";
import { pb } from "../lib/pocketbase";

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
    >
      <Text>{message.body}</Text>
    </View>
  );
};

const ChatScreen = ({ route, navigation }: any) => {
  const { userId } = route.params;

  const [message, setMessage] = useState("");

  const { user } = useAuthStore();

  const { data: messages, isLoading } = useGetMessages({
    userOrChatId: userId
  });

  const onSend = () => {
    if (!message) return;

    pb.collection("messages").create({});
  };

  return (
    <View flex={1}>
      {isLoading ? <Text>Loading Chat!</Text> : null}
      <YStack
        flex={1}
        flexDirection="column-reverse"
        paddingHorizontal="$2"
        paddingVertical="$2"
      >
        {messages?.items.map((message) => (
          <Message key={message.id} message={message} user={user} />
        ))}
      </YStack>
      <XStack gap={12} padding="$4" bg="white">
        <Input flex={1} placeholder="say hi!" />
        <Button onPress={() => alert("sent!")}>Send</Button>
      </XStack>
    </View>
  );
};

export default ChatScreen;
