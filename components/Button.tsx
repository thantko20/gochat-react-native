import clsx from "clsx";
import { ReactNode, useState } from "react";
import { Pressable, Text } from "react-native";

type Props = {
  children: ReactNode;
  isLoading?: boolean;
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
};

export const Button = (props: Props) => {
  const [isPressing, setIsPressing] = useState(false);
  const { children, isLoading = false, className, ...rest } = props;
  return (
    <Pressable
      {...rest}
      onPressIn={() => setIsPressing(true)}
      onPressOut={() => setIsPressing(false)}
    >
      <Text
        className={clsx(
          "text-white text-center py-2 px-1 rounded-md min-w-[80px]",
          isPressing ? "bg-blue-400" : "bg-blue-500",
          className
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
};
