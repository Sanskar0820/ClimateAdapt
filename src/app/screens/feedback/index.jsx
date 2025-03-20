import React, { useRef } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../../../component/Header';

const FeedbackScreen = () => {
  const webViewRef = useRef(null);

  // More specific CSS targeting
  const injectedJavaScript = `
    (function() {
      const style = document.createElement('style');
      style.textContent = \`
        /* Target common navigation elements */
        nav,
        header,
        .MuiAppBar-root,
        .MuiToolbar-root,
        #navbar,
        .navbar,
        .nav-wrapper,
        .site-header,
        .top-bar,
        .header-container,
        [role="navigation"],
        .navigation {
          display: none !important;
          height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: hidden !important;
        }
        
        /* Adjust the main content to fill the space */
        body {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
        
        #root > div {
          padding-top: 0 !important;
        }
      \`;
      document.head.appendChild(style);
      
      // Remove elements after they're loaded
      function removeNavigation() {
        const elements = document.querySelectorAll('nav, header, .MuiAppBar-root, .MuiToolbar-root');
        elements.forEach(el => el.remove());
      }
      
      // Run immediately and after a delay to ensure elements are removed
      removeNavigation();
      setTimeout(removeNavigation, 1000);
      setTimeout(removeNavigation, 2000);
    })();
    true;
  `;

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.webviewContainer}>
        <WebView 
          ref={webViewRef}
          source={{ uri: 'https://forms.gle/t3uLmxRGsMKekVLJ9' }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          injectedJavaScript={injectedJavaScript}
          onLoadEnd={() => {
            // Reapply the script when the page finishes loading
            webViewRef.current.injectJavaScript(injectedJavaScript);
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

export default FeedbackScreen;