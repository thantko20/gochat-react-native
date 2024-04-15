import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pb } from "../lib/pocketbase";
import { User } from "../types/users.type";
import { Button } from "../components/Button";
import { useGetChats } from "../api/chats";
import { Chat } from "../types/chats.types";
import useAuthStore from "../stores/useAuthStore";

const ChatItem = ({
  chat,
  currentUser,
  navigate
}: {
  chat: Chat;
  currentUser: User | null;
  navigate: StackNavigationProp<any>["navigate"];
}) => {
  const otherUser = chat.expand.users.find(
    (user) => user.id !== currentUser?.id
  );
  if (!otherUser) {
    return null;
  }
  return (
    <TouchableOpacity
      key={otherUser.id}
      onPress={() =>
        navigate("Chat", {
          userId: otherUser.id,
          name: otherUser.name,
          chatId: chat.id
        })
      }
      className="p-4 w-full divide-y"
    >
      <Text className="font-semibold text-lg">{otherUser.username}</Text>
    </TouchableOpacity>
  );
};

const MainScreen = ({
  navigation
}: {
  navigation: StackNavigationProp<any>;
}) => {
  const { user } = useAuthStore();

  const { data: chatsData, isLoading: isLoadingChats, error } = useGetChats();
  console.log(chatsData);

  const queryClient = useQueryClient();

  return (
    <View>
      <Button
        onPress={() => {
          queryClient.removeQueries();
          pb.authStore.clear();
        }}
      >
        Logout
      </Button>
      {chatsData ? (
        <ScrollView>
          {chatsData.items?.map((chat) => (
            <ChatItem
              chat={chat}
              currentUser={user}
              navigate={navigation.navigate}
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
};

export default MainScreen;
