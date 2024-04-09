import { ComponentProps } from "react";
import { Label, Input as TInput, YStack } from "tamagui";

type Props = Omit<ComponentProps<typeof TInput>, "error"> & {
  error?: string | boolean;
  label?: string;
};

const Input = ({ error, label, ...props }: Props) => {
  return (
    <YStack gap={1}>
      {label && (
        <Label fontSize="$5" fontWeight={"700"}>
          {label}
        </Label>
      )}
      <TInput {...props} />
    </YStack>
  );
};

export default Input;
