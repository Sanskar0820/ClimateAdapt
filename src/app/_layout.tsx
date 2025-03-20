import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';
import { MenuProvider } from '../context/MenuContext';
import { SelectedFeatureProvider } from '../context/SelectedFeatureContext';
import { LoaderProvider } from '../context/LoaderContext';
import { AlertProvider } from '../context/AlertContext'
import NavigationMenu from '../component/NavigationMenu';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <MenuProvider>
      <AlertProvider>
        <LoaderProvider>
          <GestureHandlerRootView>
          <SelectedFeatureProvider>
            <View style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="screens" />
              </Stack>
              <NavigationMenu />
            </View>
          </SelectedFeatureProvider>
        </GestureHandlerRootView>
        </LoaderProvider>
      </AlertProvider>
    </MenuProvider>
  );
}
