import React, {useCallback, useEffect, useRef} from 'react';
import {BackHandler, Platform, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import WebView, {WebViewNavigation} from 'react-native-webview';
import {
  OnShouldStartLoadWithRequest,
  ShouldStartLoadRequest,
} from 'react-native-webview/lib/WebViewTypes';
import {requestOnMessage, sendMessageToWeb} from '../message';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {messageName} from '../constants';
import {doubleBackPressExit} from '../hooks/useDoubleBackpress';

const injectedJavaScript = `
(function() {
  function wrap(fn) {
    return function wrapper() {
      var res = fn.apply(this, arguments);
      window.ReactNativeWebView.postMessage('navigationStateChange');
      return res;
    }
  }
  history.pushState = wrap(history.pushState);
  history.replaceState = wrap(history.replaceState);
  window.addEventListener('popstate', function() {
    window.ReactNativeWebView.postMessage('navigationStateChange');
  });

  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
  window.isWebview=true;
  return true;
})()
`;
//

const LocalHtml =
  Platform.OS === 'ios'
    ? require('../index.html')
    : {uri: 'file:///android_asset/index.html'};
const baseurl = 'https://mymerci.kr';

function MainScreen({
  navigation,
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  'MainScreen'
>): React.JSX.Element {
  const webviewRef = useRef<WebView>(null);
  const [navState, setNavState] = React.useState<WebViewNavigation>();

  useEffect(() => {
    if (route.params) {
      sendMessageToWeb(webviewRef, messageName.LINK_DATA, route.params);
    }
  }, [webviewRef, route.params]);

  const onShouldStartLoadWithRequest: OnShouldStartLoadWithRequest = (
    event: ShouldStartLoadRequest,
  ) => {
    setNavState(event);
    return true;
  };

  const onNavigationStateChange = (event: WebViewNavigation) => {
    setNavState(event);
  };

  const onPressBackPressButton = useCallback(() => {
    if (navState?.canGoBack) {
      webviewRef?.current?.goBack();
      return true;
    } else {
      doubleBackPressExit(() => {
        BackHandler.exitApp();
      });

      return true;
    }
  }, [navState?.canGoBack]);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onPressBackPressButton);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        onPressBackPressButton,
      );
    };
  }, [navState?.canGoBack, onPressBackPressButton]);

  return (
    <SafeAreaView
      edges={['right', 'bottom', 'top', 'left']}
      style={style.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        onMessage={event =>
          requestOnMessage(event, {
            webviewRef,
            navigation,
          })
        }
        injectedJavaScript={injectedJavaScript}
        onNavigationStateChange={onNavigationStateChange}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        setSupportMultipleWindows={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        source={{uri: baseurl}}
        // source={LocalHtml}
        applicationNameForUserAgent={'webviewApp/1.0.0'}
        allowsBackForwardNavigationGestures={true}
        pullToRefreshEnabled={true}
        style={style.webview}
        javaScriptCanOpenWindowsAutomatically
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

export default MainScreen;
