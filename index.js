/**
 * @format
 */
import notifee from '@notifee/react-native';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';


notifee.onBackgroundEvent(async ({ type, detail }) => {
    switch (type) {
        case notifee.EventType.PRESS:
            console.log('Background Notification pressed', detail.notification);
            // Handle the press action
            break;
    }
});

AppRegistry.registerComponent(appName, () => App);
