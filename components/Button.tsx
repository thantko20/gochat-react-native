import clsx from "clsx";
import { ReactNode, useState } from "react";
import { Pressable, Text } from "react-native";

const variants = {
  primary: "bg-blue-500 text-white",
  ghost: "bg-transparent text-blue-500"
};

type Props = {
  children: ReactNode;
  isLoading?: boolean;
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "ghost";
};

export const Button = (props: Props) => {
  const [isPressing, setIsPressing] = useState(false);
  const {
    children,
    isLoading = false,
    className,
    variant = "primary",
    ...rest
  } = props;

  return (
    <Pressable
      {...rest}
      onPressIn={() => setIsPressing(true)}
      onPressOut={() => setIsPressing(false)}
      android_ripple={{
        color: variant === "primary" ? "#fff" : undefined
      }}
      className="overflow-hidden"
    >
      <Text
        className={clsx(
          "text-center py-2 px-1 rounded-md min-w-[80px]",
          variants[variant],
          className
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
};
