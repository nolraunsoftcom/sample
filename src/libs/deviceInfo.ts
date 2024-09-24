import DeviceInfo from 'react-native-device-info';

export const getDeviceInfo = async () => {
  const version = DeviceInfo.getVersion();
  const userAgent = await DeviceInfo.getUserAgent();
  const applicationName = DeviceInfo.getApplicationName();
  const os = DeviceInfo.getBaseOs();
  const hasNotch = DeviceInfo.hasNotch();
  const bundleId = DeviceInfo.getBundleId();
  const deviceId = DeviceInfo.getDeviceId();
  const ipAddress = await DeviceInfo.getIpAddress();

  return {
    version,
    userAgent,
    applicationName,
    os,
    hasNotch,
    bundleId,
    deviceId,
    ipAddress,
  };
};
