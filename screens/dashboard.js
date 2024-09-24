import React from 'react';
import { Text, Image, View, ScrollView } from 'react-native';
import { fetchLastFirebaseData, firebaseConfigData } from '../app/firebaseData';
import useDynamicStyles from '../assets/styles/styles'
import LoadingScreen from './loading'

/* Main Function */
function DashboardScreen() {
	const styles = useDynamicStyles();
	const tempConfig = firebaseConfigData().tempConfig; 
	const { lastTemp, lastTime } = fetchLastFirebaseData();

	/* Change image color */
	const temperatureColor = (temp, minTemp, maxTemp) => {
		const redVal = 255 / (maxTemp - minTemp) * (temp - minTemp);
		const blueVal = 255 / (maxTemp - minTemp) * (maxTemp - temp);
		return `rgb(${redVal}, 0, ${blueVal})`;
	}
	
	/* Loading Screen */
	if (lastTemp === null || lastTime === null) {
		return (
			<View style={styles.LoadingContainer}>
				<LoadingScreen />
			</View>
		)
	}

	return (
		<ScrollView style={styles.contentContainer}>
			<View style={styles.container}>
				<Text style={styles.title}>Temperature en temps Réel:</Text>
				{tempConfig.length > 0 && (
					<Image
						style={{
							resizeMode: 'contain',
							height: 150,
							width: 200,
							tintColor: temperatureColor(lastTemp, tempConfig[0].minColorTemp, tempConfig[0].maxColorTemp),
						}}
						source={require('../assets/images/temperature.png')}
					/>)}
				<Text style={styles.text}>Temperature: {lastTemp}°C</Text>
				<Text style={styles.text}>Temps: {lastTime}</Text>
			</View>
		</ScrollView>
	);
}
export default DashboardScreen;