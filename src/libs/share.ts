import Share, {ShareOptions} from 'react-native-share';
import WebView from 'react-native-webview';
import {messageName} from '../constants';
export const share = (
  options: ShareOptions,
  webviewRef: React.RefObject<WebView>,
) => {
  Share.open(options)
    .then(res => {
      webviewRef.current?.postMessage(
        JSON.stringify({key: messageName.SHARE, value: res}),
      );
    })
    .catch(err => {
      webviewRef.current?.postMessage(
        JSON.stringify({key: messageName.SHARE, value: err}),
      );
    });
};
