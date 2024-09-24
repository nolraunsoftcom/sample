import {Alert, Linking} from 'react-native';
import Geolocation, {
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';

export const geoLocation = () => {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'auto',
    enableBackgroundLocationUpdates: false,
    locationProvider: 'auto',
  });

  const errorHandler = (err: GeolocationError) => {
    if (err.code === err.PERMISSION_DENIED) {
      Alert.alert('위치 조회에 실패했습니다.', '위치 권한을 허용해주세요.', [
        {
          text: '확인',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ]);
    } else {
      Alert.alert(
        '위치 조회에 실패했습니다.',
        '위치 기능을 사용할 수 없습니다.',
      );
    }
  };

  return {
    getCurrentPosition() {
      const func = new Promise(resolve => {
        Geolocation.getCurrentPosition(
          (position: GeolocationResponse) => {
            return resolve(position);
          },
          errorHandler,
          {},
        );
      });

      return new Promise(resolve => {
        Geolocation.requestAuthorization(() => {
          func.then(res => {
            return resolve(res);
          });
        }, errorHandler);
      });
    },
  };
};
