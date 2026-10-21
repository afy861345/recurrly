
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding" className="rounded bg-primary text-white mt-4 py-2 px-5">
        Go to onboarding
      </Link>
      <Link href="/(auth)/sign-in" className="rounded bg-primary text-white mt-4 p-4">
        Go to sign in
      </Link>
      <Link href="/(auth)/sign-up" className="rounded bg-primary text-white mt-4 p-4">
        Go to sign up
      </Link>
      <Link href={ "/(tabs)/subscription/spoty" as any} className="rounded bg-primary text-white mt-4 p-4">
        Spotfiy
      </Link>
    </View>
  );
}
