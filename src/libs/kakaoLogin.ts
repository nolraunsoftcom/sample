import * as KakaoLogin from '@react-native-seoul/kakao-login';

export const kakaoLogin = () => ({
  async login() {
    const response = await KakaoLogin.login();
    return response;
  },
});
