import { StackNavigationProp } from "@react-navigation/stack";
import { Pressable, Text } from "react-native";
import { Chat } from "../types/chats.types";
import { User } from "../types/users.type";
import clsx from "clsx";

export const ChatItem = ({
  chat,
  currentUser,
  navigate,
  isLastItem
}: {
  chat: Chat;
  currentUser: User | null;
  navigate: StackNavigationProp<any>["navigate"];
  isLastItem: boolean;
}) => {
  const otherUser = chat.expand.users.find(
    (user) => user.id !== currentUser?.id
  );
  if (!otherUser) {
    return null;
  }

  const lastMessage = chat.expand.lastMessage?.body;
  const isUserLastMessageSender =
    chat.expand.lastMessage?.sender === currentUser?.id;

  return (
    <Pressable
      key={otherUser.id}
      onPress={() =>
        navigate("Chat", {
          userId: otherUser.id,
          name: otherUser.name,
          chatId: chat.id
        })
      }
      android_ripple={{
        color: "#00000013"
      }}
      className={clsx(
        "p-4 w-full",
        isLastItem ? "border-none" : "border-b border-neutral-300"
      )}
    >
      <Text className="font-semibold text-lg">{otherUser.name}</Text>
      <Text>
        {isUserLastMessageSender && <Text className="font-medium">You:</Text>}{" "}
        {lastMessage}
      </Text>
    </Pressable>
  );
};
