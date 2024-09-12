import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, useColorScheme } from 'react-native';
import { displayLocalNotification, registerForPushNotificationsAsync } from './notification';
import { ref, query, orderByKey, limitToLast, onValue } from 'firebase/database';
import { database } from './firebase';

//Chart related code
import { LineChart } from 'react-native-chart-kit';

const useChartConfig = () => {
  // Get the current color scheme (light or dark)
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return {
    backgroundGradientFrom: isDarkMode ? "#000000" : "#ffffff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: isDarkMode ? "#000000" : "#ffffff",
    backgroundGradientToOpacity: 0,

    // Color of labels changes depending on dark/light mode
    color: () => isDarkMode ? `rgb(255, 255, 255)` : `rgb(0, 0, 0)`,

    // Other chart configurations
    strokeWidth: 1,

    propsForBackgroundLines: {
      strokeDasharray: "", // Removes dashed lines
    },
    propsForVerticalLabels: {
      display: 'none', // Hides X-axis labels, it is compensated by selecting specific points to view data
    },
  };
};


//Main function
const App = () => {
  const [data, setData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [lastTemp, setLastTemp] = useState(null); // Try to remove later
  const [tempConfig, setTempConfig] = useState([]); // Temperature configuration can be changed from Firebase directly
  const chartConfig = useChartConfig();

  //Notification code
  useEffect(() => {
    registerForPushNotificationsAsync();
    console.log("tempConfig  ", tempConfig[0])

    if (lastTemp !== null && tempConfig[0].maxTemp !== undefined && tempConfig[0].minTemp !== undefined) {
      if (lastTemp >= tempConfig[0].maxTemp || lastTemp <= tempConfig[0].minTemp) {
        displayLocalNotification(lastTemp);
      }
    }
  }, [lastTemp, tempConfig]);

  //Initiate chart
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      strokeWidth: 2,
    }],
    //removed legend for visibility
    //legend: ["Temperature"]
  });

  //Retrieve Temperature Config from firebase
  useEffect(() => {
    const firebaseRef = ref(database, 'TemperatureConfig')

    onValue(firebaseRef, (snapshot) => {
      if (snapshot.exists()) {
        const allData = []
        const data = snapshot.val()
        allData.push(data)

        setTempConfig(allData)
      }
    })
  }, [])

  //Recieve temperature data from firebase
  useEffect(() => {
    const firebaseRef = ref(database, 'TemperatureSensorData');
    const dataQuery = query(firebaseRef, orderByKey(), limitToLast(30));

    const unsubscribe = onValue(dataQuery, (snapshot) => {
      if (snapshot.exists()) {
        const allData = [];
        const labels = [];
        const temperatures = [];

        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          allData.push(data);
          labels.push(data.timestamp);
          temperatures.push(data.temperature.valueOf());
        });

        setData(allData);

        // Update chart data state
        setChartData({
          labels: labels,
          datasets: [{
            data: temperatures,
            strokeWidth: 2,
          }],
          //legend: ["Temperature"]
        });

        const currentLastTemp = allData[allData.length - 1].temperature;
        setLastTemp(currentLastTemp);
      } else {
        console.log('No data available');
      }
    });

    // Cleanup subscription on unmount (make sure the code works without notifications on until later fix)
    return () => unsubscribe();
  }, []);


  //Read name... it explains everything, everything
  const handleDataPointClick = (data) => {
    const index = data.index;
    const value = data.value;
    const label = chartData.labels[index];

    setSelectedPoint({ label, value });
  };

  //Change image color
  const temperatureColor = (temp, minTemp, maxTemp) => {
    const redVal = 255 / (maxTemp - minTemp) * (temp - minTemp);
    const blueVal = 255 / (maxTemp - minTemp) * (maxTemp - temp);
    return `rgb(${redVal}, 0, ${blueVal})`;
  }

  //Display code
  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <View style={styles.container}>
          <Text style={styles.title}>Last measured temperature :</Text>
          <Text style={styles.text}>Temps: {data[data.length - 1].timestamp}</Text>
          {tempConfig.length > 0 && (
            <Image
              style={{
                resizeMode: 'contain',
                height: 150,
                width: 200,
                tintColor: temperatureColor(data[data.length - 1].temperature, tempConfig[0].minColorTemp, tempConfig[0].maxColorTemp),
              }}
              source={require('./assets/images/temperature.png')}
            />)}
          <Text style={styles.text}>Temperature: {lastTemp}°C</Text>
          {chartData.datasets[0].data.length > 0 && ( //3 day bug...
            <LineChart
              data={chartData}
              width={400}
              height={256}
              chartConfig={chartConfig}
              //bezier //smoothens the line
              fromZero
              onDataPointClick={handleDataPointClick}
            />)}
          {selectedPoint && (
            <View /* style={styles.container} */>
              <Text style={styles.text}>
                Selected Point: {selectedPoint.label} - {selectedPoint.value}°C
              </Text>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.text}>Loading...</Text>
      )}
    </View>
  );
};

//Stylesheet (like CSS)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default App;
