import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

// Display local notification using Notifee
export async function displayLocalNotification(temperature) {
	await notifee.displayNotification({
		title: 'Alerte de température',
		body: `La temperature est à ${temperature}°C!`,
		android: {
			channelId: 'Temperature',
			importance: AndroidImportance.HIGH,
		},
		ios: {
			sound: 'default',
		},
	});
}

// Set up notification channel
export async function registerForPushNotificationsAsync() {
	if (Platform.OS === 'android') {
		await notifee.createChannel({
			id: 'Temperature',
			name: 'Temperature alert',
			importance: AndroidImportance.HIGH,
			vibration: true,
		});
	}
	return 'Local notifications set up successfully';
}


notifee.registerForegroundService(() => {
	return new Promise((resolve) => {
		notifee.displayNotification({
			title: 'Fonctionne en arrière-plan',
			body: 'La surveillance de la température est active.',
			android: {
				channelId: 'Temperature',
				importance: AndroidImportance.HIGH,
			},
		});
		resolve();
	});
});