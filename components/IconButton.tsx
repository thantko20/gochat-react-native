import clsx from "clsx";
import { ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  isLoading?: boolean;
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
  icon: JSX.Element;
};

export const IconButton = (props: Props) => {
  const [isPressing, setIsPressing] = useState(false);
  const { icon, isLoading = false, className, ...rest } = props;
  return (
    <Pressable
      {...rest}
      onPressIn={() => setIsPressing(true)}
      onPressOut={() => setIsPressing(false)}
    >
      <View
        className={clsx(
          "text-white flex items-center justify-center rounded-md w-10 h-10",
          isPressing ? "bg-blue-400" : "bg-blue-500",
          className
        )}
      >
        {icon}
      </View>
    </Pressable>
  );
};
