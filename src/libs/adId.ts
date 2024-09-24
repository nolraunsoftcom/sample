import ReactNativeIdfaAaid, {
  AdvertisingInfoResponse,
} from '@sparkfabrik/react-native-idfa-aaid';

export const getIdfa = (): Promise<string | null> => {
  return ReactNativeIdfaAaid.getAdvertisingInfo()
    .then((res: AdvertisingInfoResponse) => {
      if (res.isAdTrackingLimited) {
        return null;
      }
      return res.id;
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};
