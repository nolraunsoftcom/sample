import messaging from '@react-native-firebase/messaging';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Alert, Linking, NativeModules, Platform} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import * as RNFS from '@dr.pogodin/react-native-fs';

import {messageName} from './constants';
import {
  appleLogin,
  kakaoLogin,
  googleLogin,
  getDeviceInfo,
  getIdfa,
  share,
  naverLogin,
  geoLocation,
} from './libs';
import {RootStackParamList} from './App';
import {launchCamera} from 'react-native-image-picker';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export function sendMessageToWeb(
  webviewRef: React.RefObject<WebView>,
  key: string,
  value: any,
) {
  webviewRef.current?.postMessage(
    JSON.stringify({
      key,
      value,
    }),
  );
}

export const requestOnMessage = async (
  event: WebViewMessageEvent,
  {
    webviewRef,
  }: {
    webviewRef: React.RefObject<WebView>;
    navigation: NativeStackNavigationProp<RootStackParamList, 'MainScreen'>;
  },
) => {
  if (!event) return;

  const data = JSON.parse(event.nativeEvent.data) as {key: string; value?: any};

  switch (data.key) {
    case messageName.GOOGLE_LOGIN: {
      const response = await googleLogin().login();

      sendMessageToWeb(webviewRef, data.key, response);
      break;
    }
    case messageName.KAKAO_LOGIN: {
      const response = await kakaoLogin().login();
      sendMessageToWeb(webviewRef, data.key, response);
      break;
    }
    case messageName.APPLE_LOGIN: {
      const response =
        Platform.OS === 'ios'
          ? await appleLogin().iosLogin()
          : await appleLogin().aosLogin();

      sendMessageToWeb(webviewRef, data.key, response);
      break;
    }
    case messageName.NAVER_LOGIN: {
      const response = await naverLogin().login();
      sendMessageToWeb(webviewRef, data.key, response);
      break;
    }

    case messageName.IDFA: {
      getIdfa()
        .then(response => {
          sendMessageToWeb(webviewRef, data.key, response);
        })
        .catch(e => {
          console.log(e);
        });
      break;
    }

    case messageName.DEVICE_INFO: {
      getDeviceInfo()
        .then(response => {
          sendMessageToWeb(webviewRef, data.key, response);
        })
        .catch(e => {
          console.log(e);
        });
      break;
    }

    case messageName.SHARE: {
      share(data.value, webviewRef);
      break;
    }

    case messageName.SETTING: {
      Linking.openSettings();
      break;
    }

    case messageName.CAMERA: {
      function func() {
        launchCamera(
          {
            maxWidth: 700,
            mediaType: 'photo',
            quality: 0.7,
          },
          ({assets}) => {
            if (typeof assets === 'undefined' || assets?.length === 0) return;

            ImageResizer.createResizedImage(
              assets[0].uri!,
              700,
              700,
              'JPEG',
              70,
              0,
              RNFS.DocumentDirectoryPath,
            )
              .then(res => {
                RNFS.readFile(res.path, 'base64').then(res => {
                  console.log(res.length);
                  sendMessageToWeb(webviewRef, data.key, res);
                });
              })
              .catch(err => {
                console.log(err);
              });
          },
        );
      }
      const CHECK = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA,
      );

      if (CHECK === RESULTS.GRANTED) func();

      if (CHECK === RESULTS.DENIED) {
        const RESULT = await request(
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA,
        );

        if (RESULT !== RESULTS.GRANTED) {
          Alert.alert('카메라 권한이 필요합니다.', '', [
            {
              text: '확인',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]);

          return;
        }

        func();
      }

      break;
    }

    case messageName.DEVICE_TOKEN: {
      try {
        const token = await messaging().getToken();

        console.log('token', token);

        sendMessageToWeb(webviewRef, data.key, token);
      } catch (e) {
        sendMessageToWeb(webviewRef, data.key, null);
      }
      break;
    }
    case messageName.POSITION: {
      const response = await geoLocation().getCurrentPosition();
      sendMessageToWeb(webviewRef, data.key, response);
      break;
    }

    case messageName.LANGUAGE: {
      console.log('lsdknlkasndglkn');
      new Promise(resolve => {
        const deviceLanguage =
          Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
              NativeModules.SettingsManager.settings.AppleLanguages[0]
            : NativeModules.I18nManager.localeIdentifier;

        return resolve(deviceLanguage);
      })
        .then(res => {
          console.log('res', res);
          sendMessageToWeb(webviewRef, data.key, res);
        })
        .catch(() => {
          sendMessageToWeb(webviewRef, data.key, 'ko_KR');
        });

      break;
    }

    default:
      null;
  }
};
