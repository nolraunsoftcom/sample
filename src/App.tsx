import React from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';

// screens
export type RootStackParamList = {
  MainScreen: {
    data: any;
  };
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
export function navigate(data: any) {
  if (navigationRef.isReady()) {
    navigationRef.setParams({
      data,
    });
  }
}
import MainScreen from './screens/main.screen';
import {useInitialPermission} from './hooks/useInitialPermission';
import {displayNotification} from './libs/displayNotification';
import SplashScreen from 'react-native-splash-screen';
import {Platform, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  React.useEffect(() => {
    return messaging().onMessage(async remoteMessage => {
      displayNotification(remoteMessage);
    });
  }, []);

  React.useEffect(() => {
    SplashScreen.hide();

    notifee.setBadgeCount(0);

    // background state 에서 들어왔을때,
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (Platform.OS === 'android') {
        if (remoteMessage) {
          navigate(remoteMessage.data);
        }
      }
    });

    // quit state 에서 들어왔을때,
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (Platform.OS === 'android') {
          if (remoteMessage) {
            navigate(remoteMessage.data);
          }
        }
      })
      .catch(console.error);

    notifee.onBackgroundEvent(async event => {
      notifee.decrementBadgeCount();

      delete event.detail.notification?.android;
      delete event.detail.notification?.ios;
      navigate(event.detail.notification?.data);
    });

    // foreground state에서 푸시 클릭
    return notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        notifee.decrementBadgeCount();

        delete detail.notification?.android;
        delete detail.notification?.ios;
        navigate(detail.notification?.data);
      }
    });
  }, []);

  useInitialPermission();
  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaProvider style={style.container}>
        <Stack.Navigator initialRouteName="MainScreen">
          <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
