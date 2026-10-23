import "@global.css";
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useRef } from "react";
import { ClerkProvider, useUser } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { PostHogProvider } from 'posthog-react-native'
import { isPostHogConfigured, posthog } from '../lib/posthog'
SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

function PostHogIdentity() {
  const { isLoaded, user } = useUser()
  const identifiedUserId = useRef<string | null>(null)

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    if (!user) {
      identifiedUserId.current = null
      return
    }

    if (identifiedUserId.current === user.id) {
      return
    }

    posthog?.identify(user.id, {
      $set: {
        ...(user.primaryEmailAddress?.emailAddress
          ? { email: user.primaryEmailAddress.emailAddress }
          : {}),
        ...(user.firstName ? { first_name: user.firstName } : {}),
        ...(user.lastName ? { last_name: user.lastName } : {}),
      },
    })
    identifiedUserId.current = user.id
  }, [isLoaded, user])

  return null
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('@/assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('@/assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('@/assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('@/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('@/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('@/assets/fonts/PlusJakartaSans-Light.ttf')
  })

  useEffect(() => {
    // Hide splash only when both fonts and auth are loaded
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  // Don't render app until both are ready
  if (!fontsLoaded) return null;
  
  return (
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          {isPostHogConfigured && posthog ? (
            <PostHogProvider client={posthog}>
              <PostHogIdentity />
              <Stack screenOptions={{headerShown: false}}/>
            </PostHogProvider>
          ) : (
            <Stack screenOptions={{headerShown: false}}/>
          )}
      </ClerkProvider>
  );

}