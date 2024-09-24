import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';

export const appleLogin = () => {
  return {
    async iosLogin() {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      return {
        ...appleAuthRequestResponse,
        id_token: appleAuthRequestResponse.identityToken,
      };
    },

    async aosLogin() {
      try {
        const rawNonce = new Date().getTime().toString();
        const state = new Date().getTime().toString();
        appleAuthAndroid.configure({
          clientId: 'kr.mymerci',
          redirectUri: 'https://mymerci.kr/pages/apple.php',
          scope: appleAuthAndroid.Scope.ALL,
          responseType: appleAuthAndroid.ResponseType.ALL,
          nonce: rawNonce,
          state,
        });

        const response = await appleAuthAndroid.signIn();

        return response;
      } catch (error) {}
    },
  };
};
