import { ComponentProps } from "react";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

type Props = Omit<ComponentProps<typeof TextInput>, "error"> & {
  error?: string | boolean;
};

const Input = ({ error, ...props }: Props) => {
  return (
    <View>
      <TextInput {...props} error={Boolean(error)} />
      <HelperText
        type="error"
        visible={typeof error === "string" && !!error}
        padding="none"
      >
        {error}
      </HelperText>
    </View>
  );
};

export default Input;
