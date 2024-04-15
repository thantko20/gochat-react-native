import clsx from "clsx";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Message } from "../types/messages.types";
import { User } from "../types/users.type";
import useAuthStore from "../stores/useAuthStore";
import { isLoading } from "expo-font";
import { ReactNode } from "react";

const MessageItem = ({
  message,
  user
}: {
  message: Message;
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

export const MessagesContainer = ({
  messages,
  hasNextPage,
  fetchNextPage,
  isLoadingChat,
  isFetchingMore
}: {
  messages: Message[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoadingChat: boolean;
  isFetchingMore: boolean;
}) => {
  const { user } = useAuthStore();

  return isLoadingChat ? (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color={"blue"} />
    </View>
  ) : (
    <View className="flex-1">
      {isFetchingMore ? (
        <ActivityIndicator size={"large"} color={"blue"} />
      ) : null}
      <FlatList
        inverted
        className="px-2"
        contentContainerStyle={{
          gap: 10
        }}
        data={messages || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageItem message={item} user={user} />}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
      />
    </View>
  );
};
