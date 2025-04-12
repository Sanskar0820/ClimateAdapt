import React, { useRef, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../../../component/Header';
import { useTranslation } from 'react-i18next';

const DashboardScreen = () => {
  const { i18n } = useTranslation();
  const selectedLanguage = i18n.language;
  const webViewRef = useRef(null);

  const injectedJavaScript = `
    (function() {
      const style = document.createElement('style');
      style.textContent = \`
        nav, header, .MuiAppBar-root, .MuiToolbar-root, #navbar, .navbar,
        .nav-wrapper, .site-header, .top-bar, .header-container, [role="navigation"],
        .navigation {
          display: none !important;
          height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: hidden !important;
        }

        body {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }

        #root > div {
          padding-top: 0 !important;
        }
      \`;
      document.head.appendChild(style);

      function removeNavigation() {
        const elements = document.querySelectorAll('nav, header, .MuiAppBar-root, .MuiToolbar-root');
        elements.forEach(el => el.remove());
      }

      removeNavigation();
      setTimeout(removeNavigation, 1000);
      setTimeout(removeNavigation, 2000);
    })();
    true;
  `;

  // ✅ Send language every time it changes
  useEffect(() => {
    const message = JSON.stringify({ type: 'SET_LANGUAGE', lang: selectedLanguage });
    if (webViewRef.current) {
      webViewRef.current.postMessage(message);
    }
  }, [selectedLanguage]);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://map-dashboard-8ztt.onrender.com/' }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          injectedJavaScript={injectedJavaScript}
          onLoadEnd={() => {
            webViewRef.current.injectJavaScript(injectedJavaScript);
            const message = JSON.stringify({ type: 'SET_LANGUAGE', lang: selectedLanguage });
            webViewRef.current.postMessage(message); // send language on initial load
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    height: 400,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  webview: {
    flex: 1,
  },
});

export default DashboardScreen;
