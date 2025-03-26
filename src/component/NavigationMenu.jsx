import { StyleSheet, Text, View, TouchableOpacity, Animated, Linking } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { useMenu } from '../context/MenuContext';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const NavigationMenu = () => {
  const { isMenuOpen, setIsMenuOpen } = useMenu();
  const { t } = useTranslation(); // ✅ Import translation function
  const router = useRouter();
  const currentPath = usePathname();
  const slideAnim = React.useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isMenuOpen ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuOpen]);

  const menuItems = [
    { title: t('menu.home'), path: '/', icon: 'home-outline' },
    { title: t('menu.meteorological'), path: '/screens/meteorological', icon: 'cloudy-outline' },
    { title: t('menu.hydrological'), path: '/screens/hydrological', icon: 'analytics-outline' },
    { title: t('menu.drought'), path: '/screens/drought', icon: 'water-outline' },
    { title: t('menu.weather'), path: '/screens/weather', icon: 'thermometer-outline' },
    { title: t('menu.map'), path: '/screens/dashboard', icon: 'map-outline' },
    { 
      title: t('menu.vegetation'), 
      url: 'https://akankshayadaw.users.earthengine.app/view/test', 
      icon: 'leaf-outline', 
      isExternal: true 
    },
    { 
      title: t('menu.landUse'), 
      url: 'https://akankshayadaw.users.earthengine.app/view/lulc', 
      icon: 'layers-outline', 
      isExternal: true 
    },
    { title: t('menu.info'), path: '/screens/info', icon: 'information-circle-outline' },
    { title: t('menu.contact'), path: '/screens/contact', icon: 'call-outline' },
    { title: t('menu.feedback'), path: '/screens/feedback', icon: 'call-outline' },
  ];

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  const handleExternalLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.warn(`Cannot open URL: ${url}`);
      }
    } catch (error) {
      console.error(`Error opening URL: ${error}`);
    }
  };

  if (!isMenuOpen) return null;

  return (
    <>
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={() => setIsMenuOpen(false)}
      />
      <Animated.View 
        style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>ClimateAdapt</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.menuContent}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.menuItem,
                !item.isExternal && currentPath === item.path && styles.activeMenuItem
              ]}
              onPress={() => item.isExternal ? handleExternalLink(item.url) : handleNavigation(item.path)}
            >
              <Ionicons 
                name={item.icon} 
                size={24} 
                color={!item.isExternal && currentPath === item.path ? '#003580' : '#666'} 
                style={styles.menuIcon}
              />
              <Text style={[
                styles.menuText,
                !item.isExternal && currentPath === item.path && styles.activeMenuText
              ]}>
                {item.title}
              </Text>
              {item.isExternal && (
                <Ionicons 
                  name="open-outline" 
                  size={16} 
                  color="#666" 
                  style={styles.externalIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('menu.version')}</Text>
        </View>
      </Animated.View>
    </>
  )
}

export default NavigationMenu;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: 'white',
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#003580',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  },
  menuContent: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#666',
  },
  activeMenuItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  activeMenuText: {
    color: '#003580',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
  externalIcon: {
    marginLeft: 'auto',
    marginRight: 10,
  },
});
