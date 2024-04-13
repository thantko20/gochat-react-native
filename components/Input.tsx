import { ComponentProps } from "react";
import { Text, TextInput, View } from "react-native";

type Props = ComponentProps<typeof TextInput> & {
  error?: string | boolean;
  label?: string;
};

const Input = ({ error, label, ...props }: Props) => {
  return (
    <View className="gap-2">
      {label && <Text className="font-sembold">{label}</Text>}
      <TextInput {...props} className="py-1 px-2 bg-neutral-200 rounded" />
      {typeof error === "string" && (
        <Text className="text-red-500">{error}</Text>
      )}
    </View>
  );
};

export default Input;
