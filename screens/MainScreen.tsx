import { ScrollView, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { pb } from "../lib/pocketbase";
import { Button } from "../components/Button";
import { useGetChats } from "../api/chats";
import useAuthStore from "../stores/useAuthStore";
import { RootStackScreenProps } from "../types/navigation.types";
import { useLoader } from "../stores/useLoaderStore";
import { useEffect } from "react";
import { ChatItem } from "../components/ChatItem";

const MainScreen = ({ navigation }: RootStackScreenProps<"Main">) => {
  const { user } = useAuthStore();

  const { data: chatsData, isLoading: isLoadingChats, error } = useGetChats();
  useLoader(isLoadingChats);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (error) {
      console.log("There was an error in getting chats: ", error.message);
    }
  }, [error]);

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
          {chatsData.items?.map((chat, idx) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              currentUser={user}
              navigate={navigation.navigate}
              isLastItem={idx === chatsData.items.length - 1}
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
};

export default MainScreen;
