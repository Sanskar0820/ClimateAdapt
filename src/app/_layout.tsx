import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';
import { MenuProvider } from '../context/MenuContext';
import { SelectedFeatureProvider } from '../context/SelectedFeatureContext';
import { LoaderProvider } from '../context/LoaderContext';
import { AlertProvider } from '../context/AlertContext';
import NavigationMenu from '../component/NavigationMenu';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await i18n.init(); // Initialize i18n before hiding splash screen
        setIsReady(true);
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Error initializing i18n:', error);
      }
    };

    prepare();
  }, []);

  if (!isReady) return null; // Prevent rendering until language setup is complete

  return (
    <I18nextProvider i18n={i18n}>
      <MenuProvider>
        <AlertProvider>
          <LoaderProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
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
    </I18nextProvider>
  );
}
