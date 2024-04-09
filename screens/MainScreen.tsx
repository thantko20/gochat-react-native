import { ScrollView, View, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pb } from "../lib/pocketbase";
import { User } from "../types/user";
import { Button, Text } from "tamagui";

const MainScreen = ({
  navigation
}: {
  navigation: StackNavigationProp<any>;
}) => {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => pb.collection("users").getList<User>(1, 50)
  });

  const queryClient = useQueryClient();

  return (
    <View>
      <Button
        onPress={async () => {
          queryClient.removeQueries();
          pb.authStore.clear();
        }}
      >
        Log Out
      </Button>

      {data ? (
        <ScrollView>
          {data.items?.map((u) => (
            <TouchableOpacity
              key={u.username}
              style={{
                padding: 16,
                width: "100%"
              }}
              onPress={() => {
                navigation.navigate("Chat", { userId: u.id, name: u.name });
              }}
            >
              <Text>{u.username}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
};

export default MainScreen;
