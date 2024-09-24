import {
  statusCodes,
  isErrorWithCode,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

export const googleLogin = () => {
  GoogleSignin.configure({
    webClientId:
      '560125440578-s1nia8127sofi3tu8ukeuk4fuhi3lcta.apps.googleusercontent.com',
  });

  return {
    async login() {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        return userInfo;
      } catch (error) {
        console.log('error', error);

        if (isErrorWithCode(error)) {
          switch (error.code) {
            case statusCodes.SIGN_IN_CANCELLED:
              // user cancelled the login flow
              break;
            case statusCodes.IN_PROGRESS:
              // operation (eg. sign in) already in progress
              break;
            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
              // play services not available or outdated
              break;
            default:
            // some other error happened
          }
        } else {
          // an error that's not related to google sign in occurred
        }
      }
    },
  };
};
