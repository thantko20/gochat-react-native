import { ScrollView, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { pb } from "../lib/pocketbase";
import { Button } from "../components/Button";
import { chatKeys, useGetChats } from "../api/chats";
import useAuthStore from "../stores/useAuthStore";
import { RootStackScreenProps } from "../types/navigation.types";
import { useLoader } from "../stores/useLoaderStore";
import { useEffect } from "react";
import { ChatItem } from "../components/ChatItem";
import { ClientResponseError, RecordSubscription } from "pocketbase";
import { Chat, GetChats } from "../types/chats.types";

const useChatSubscriptions = (query?: GetChats | undefined) => {
  const { refetch } = useGetChats(query);
  const { user } = useAuthStore();
  useEffect(() => {
    const subscriptionHandler = (data: RecordSubscription<Chat>) => {
      if (data.record.users.includes(user?.id || "")) {
        refetch();
      }
    };

    const initSubscription = async () => {
      try {
        console.log("Connecting to event source");
        await pb.collection("chats").subscribe("*", subscriptionHandler);
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
        await pb.collection("chats").unsubscribe("*");
        console.log("Unsubscribed");
      })();
    };
  }, []);
};

const MainScreen = ({ navigation }: RootStackScreenProps<"Main">) => {
  const { user } = useAuthStore();

  const { data: chatsData, isLoading: isLoadingChats, error } = useGetChats();
  console.log(Object.keys(chatsData?.items[0]?.expand || {}));
  useLoader(isLoadingChats);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (error) {
      console.log("There was an error in getting chats: ", error.message);
    }
  }, [error]);

  useChatSubscriptions();

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
