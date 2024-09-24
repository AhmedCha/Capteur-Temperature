import React, { useEffect, useState } from 'react';
import { Text, Image, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { firebaseData, firebaseConfigData } from '../app/firebaseData';
import useDynamicStyles from '../assets/styles/styles'
import LoadingScreen from './loading'


function DashboardScreen() {
  const styles = useDynamicStyles();
	const tempConfig = firebaseConfigData().tempConfig; // Temperature configuration can be changed from Firebase directly	
	const { lastTemp, lastTime } = firebaseData();

	//Change image color
	const temperatureColor = (temp, minTemp, maxTemp) => {
		const redVal = 255 / (maxTemp - minTemp) * (temp - minTemp);
		const blueVal = 255 / (maxTemp - minTemp) * (maxTemp - temp);
		return `rgb(${redVal}, 0, ${blueVal})`;
	}

	if (lastTemp === null || lastTime === null) {
		return (
			<View style={{ flex: 1 }}>
				<LoadingScreen />
			</View>
		)
	}

	return (
		<ScrollView style={styles.contentContainer}>
			<View style={styles.container}>
				<Text style={styles.title}>Dernière température mesurée :</Text>
				<Text style={styles.text}>Temps: {lastTime}</Text>
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

			</View>

		</ScrollView>
	);
}
export default DashboardScreen;