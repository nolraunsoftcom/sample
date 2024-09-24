import type {} from '@react-native-seoul/naver-login';
import NaverLogin from '@react-native-seoul/naver-login';

export const naverLogin = () => {
  NaverLogin.initialize({
    appName: 'ssalmukApp',
    consumerKey: 'QnGlwiy1PHgfufFmsf1y',
    consumerSecret: 'EhoMqVBgSu',
    disableNaverAppAuthIOS: false,
    serviceUrlSchemeIOS: 'ssalmukApp',
  });

  return {
    async login() {
      const result = await NaverLogin.login();

      if (result.isSuccess) {
        return result;
      } else {
        throw new Error('Naver login failed');
      }
    },
  };
};
