import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";
import useAuthStore from "../stores/useAuthStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../lib/api";

const MainScreen = ({
  navigation
}: {
  navigation: StackNavigationProp<any>;
}) => {
  const { logout } = useAuthStore();
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      api
        .get<{ data: { id: number; username: string }[] }>("/users")
        .then((res) => res.data)
  });

  return (
    <View>
      <Button
        onPress={async () => {
          logout();
          await AsyncStorage.removeItem("accessToken");
          navigation.navigate("Auth", { screen: "Login" });
        }}
        mode="contained-tonal"
      >
        Log Out
      </Button>

      {data ? (
        <ScrollView>
          {data.data?.map((u) => (
            <View key={u.id}>
              <Text>{u.username}</Text>
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
};

export default MainScreen;
