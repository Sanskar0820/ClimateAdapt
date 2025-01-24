import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';
import { MenuProvider } from '../context/MenuContext';
import { SelectedFeatureProvider } from '../context/SelectedFeatureContext';
import { LoaderProvider } from '../context/LoaderContext';
import NavigationMenu from '../component/NavigationMenu';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <MenuProvider>
        <LoaderProvider>
          <SelectedFeatureProvider>
            <View style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="screens" />
              </Stack>
              <NavigationMenu />
            </View>
          </SelectedFeatureProvider>
        </LoaderProvider>
    </MenuProvider>
  );
}
