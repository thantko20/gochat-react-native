import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pb } from "../lib/pocketbase";
import { User } from "../types/user";
import { Button } from "../components/Button";

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
        Logout
      </Button>

      {data ? (
        <ScrollView>
          {data.items?.map((u) => (
            <TouchableOpacity
              key={u.username}
              onPress={() => {
                navigation.navigate("Chat", { userId: u.id, name: u.name });
              }}
              className="p-4 w-full divide-y"
            >
              <Text className="font-semibold text-lg">{u.username}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
};

export default MainScreen;
