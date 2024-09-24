import {useEffect} from 'react';
import {AppState, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';

export async function useInitialPermission() {
  useEffect(() => {
    const listener = AppState.addEventListener('change', async status => {
      if (status === 'active') {
        if (Platform.OS === 'ios') {
          await messaging().requestPermission();
          check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then(result => {
            if (result === RESULTS.DENIED) {
              request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
            }
          });
        }

        if (Platform.OS === 'android') {
          await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        }
      }
    });

    return listener?.remove;
  }, []);
}
