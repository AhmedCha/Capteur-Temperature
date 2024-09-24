import React, { useEffect, useState } from 'react';
import { Text, useColorScheme, View, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import useDynamicStyles from '../assets/styles/styles'
import LoadingScreen from './loading'
import { Dimensions } from 'react-native';
import { fetchTemperatureAverages, useFetchLast30Values } from '../app/firebaseData';

const useChartConfig = () => {
	const colorScheme = useColorScheme();
	const isDarkMode = colorScheme === 'dark';
	return {
		backgroundGradientFrom: isDarkMode ? "#000000" : "#ffffff",
		backgroundGradientFromOpacity: 0,
		backgroundGradientTo: isDarkMode ? "#000000" : "#ffffff",
		backgroundGradientToOpacity: 0,
		color: () => isDarkMode ? `rgb(255, 255, 255)` : `rgb(0, 0, 0)`,
		strokeWidth: 1,
		propsForBackgroundLines: {
			strokeDasharray: "", // Removes dashed lines
		},
		propsForVerticalLabels: {
			display: 'none', // Hides X-axis labels, it is compensated by selecting specific points to view data
		},
	};
};

/* Main Function */
function HistoryScreen() {
	const { width } = Dimensions.get('window');
	const styles = useDynamicStyles();
	const last30Values = useFetchLast30Values();
	const [selectedValue, setSelectedValue] = useState("instantly");
	const [selectedPoint, setSelectedPoint] = useState(null);
	const chartConfig = useChartConfig();

	/* Initialise chart data */
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [{
			data: [],
			strokeWidth: 2,
		}],
		/* removed legend for visibility */
		/* legend: ["Temperature"] */
	});

	const updateChartData = (data) => {
		if (data && data.length > 0) {
			const newTemperatures = data.map(item => parseFloat(item.temperature));
			const newTimestamps = data.map(item => item.timestamp);

			setChartData({
				labels: newTimestamps,
				datasets: [{
					data: newTemperatures,
					strokeWidth: 2,
				}],
			});
		}
	};

	const handleDataPointClick = (data) => {
		const index = data.index;
		const value = data.value;
		const label = chartData.labels[index];

		setSelectedPoint({ label, value });
	};

	/* Get averages from firebase */
	useEffect(() => {
		const updateChart = async () => {
			if (selectedValue === 'instantly') {
				updateChartData(last30Values);
			}
			else {
				try {
					const averages = await fetchTemperatureAverages();
					switch (selectedValue) {
						case 'day':
							updateChartData(averages.last24HourAverages);
							break;
						case 'week':
							updateChartData(averages.lastWeekAverages);
							break;
						case 'month':
							updateChartData(averages.lastMonthAverages);
							break;
						default:
							break;
					}
				} catch (error) {
					console.error("Error fetching temperature data or calculating averages:", error);
				}
			}
		};

		updateChart();

	}, [last30Values, selectedValue]);

	/* Loading Screen */
	if (!chartData.datasets[0].data.length > 0) {
		return (
			<View style={styles.LoadingContainer}>
				<LoadingScreen />
			</View>
		)
	}

	return (
		<ScrollView style={styles.contentContainer}>
			<View style={styles.container}>
				{/* picker */}
				<View style={styles.dropdownContainer}>
					<Text style={styles.title}>Selectionner la periode de temps a visualiser:</Text>
					<Picker
						selectedValue={selectedValue}
						onValueChange={(itemValue) => setSelectedValue(itemValue)}
						style={styles.picker}
					>
						<Picker.Item label="Dernier 5 minutes" value="instantly" />
						<Picker.Item label="Dernier 24 heurs" value="day" />
						<Picker.Item label="Dernier 7 jours" value="week" />
						<Picker.Item label="Dernier 30 jours" value="month" />
					</Picker>
				</View>
				<View style={{ paddingBottom: 40 }}></View>
				{/* end picker */}
				{chartData.datasets[0].data.length > 0 && ( //3 day bug...
					<LineChart
						data={chartData}
						width={width - 60}
						height={256}
						chartConfig={chartConfig}
						//bezier /* smoothens the line, removed caus unnessessary */
						fromZero
						onDataPointClick={handleDataPointClick}
					/>)}
				{selectedPoint && (
					<View>
						<Text style={styles.text}>
							Point sélectionné : {selectedPoint.value}°C ({selectedPoint.label})
						</Text>
					</View>
				)}
			</View>
		</ScrollView>
	);
}

export default HistoryScreen;