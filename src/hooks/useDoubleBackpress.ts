/**
 * @Platform android
 * 안드로이드에서 백버튼 클릭시 동작 처리
 */

import {Platform, ToastAndroid} from 'react-native';

let currentCount = 0;

const backPressHandler = () => {
  if (currentCount < 1) {
    currentCount += 1;
    ToastAndroid.showWithGravity(
      '한번 더 터치시 앱이 종료됩니다.',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  }
  setTimeout(() => {
    currentCount = 0;
  }, 1000);
};

export const doubleBackPressExit = (exitHandler: () => void): void => {
  if (Platform.OS === 'ios') {
    return;
  }

  if (currentCount === 1) {
    exitHandler();
    return;
  }

  backPressHandler();
};
