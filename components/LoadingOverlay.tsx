import { ActivityIndicator, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

export const LoadingOverlay = ({ loading = true }: { loading?: boolean }) => {
  return <Spinner visible={loading} />;
};
