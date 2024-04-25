import clsx from "clsx";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Message } from "../types/messages.types";
import { User } from "../types/users.type";
import useAuthStore from "../stores/useAuthStore";

const MessageItem = ({
  message,
  user
}: {
  message: Message;
  user: User | null;
}) => {
  const isUserSender = user?.id === message.sender;
  return (
    <View
      key={message.id}
      className={clsx(
        "p-2 rounded-md w-[55%]",
        isUserSender ? "self-end bg-blue-500" : "self-start bg-white",
        message.isSending && "bg-blue-300"
      )}
    >
      <Text className={clsx(isUserSender ? "text-white" : "text-black")}>
        {message.body}
      </Text>
    </View>
  );
};

export const MessagesContainer = ({
  messages,
  hasNextPage,
  fetchNextPage,
  isFetchingMore
}: {
  messages: Message[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoadingChat: boolean;
  isFetchingMore: boolean;
}) => {
  const { user } = useAuthStore();

  return (
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
