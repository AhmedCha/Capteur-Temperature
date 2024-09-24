import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { ref, query, onValue, orderByKey, limitToLast, get, update } from 'firebase/database';
import { database } from './firebase';

/* Fetch the stored averages from Firebase */
export const fetchTemperatureAverages = async () => {
  const averagesRef = ref(database, "TemperatureAverages");
  const snapshot = await get(averagesRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};

/* Get the last 30 value from firebase (approximatly last 5 minutes) */
export const useFetchLast30Values = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const firebaseRef = ref(database, 'TemperatureSensorData');
    const dataQuery = query(firebaseRef, orderByKey(), limitToLast(30));

    const unsubscribe = onValue(dataQuery, (snapshot) => {
      if (snapshot.exists()) {
        const allData = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          allData.push(data);
        });
        setData(allData);
      } else {
        console.log('No data available');
      }
    });

    return () => unsubscribe();

  }, []);

  return data;
};

/* Get the last value from firebase */
export const fetchLastFirebaseData = () => {
	const [lastTemp, setLastTemp] = useState(null);
	const [lastTime, setLastTime] = useState(null);

	useEffect(() => {
		const firebaseRef = ref(database, 'TemperatureSensorData');
		const dataQuery = query(firebaseRef, limitToLast(1));

		onValue(dataQuery, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				const lastEntry = Object.values(data)[0];
				const temperature = Number(lastEntry.temperature);

				setLastTemp(!isNaN(temperature) ? temperature : 0); // Ensure temperature is a valid number
				setLastTime(lastEntry.timestamp);
			} else {
				console.log('No data available');
			}
		});
	}, []);

	return { lastTemp, lastTime };
};


/* Load Config from Firebase */
export const firebaseConfigData = () => {
	const [tempConfig, setTempConfig] = useState([]); 

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

	return { tempConfig };
};

/* Update Config to Firebase */
export const updateFirebaseConfigData = async (minTemp, maxTemp, minColorTemp, maxColorTemp) => {
	const firebaseRef = ref(database, 'TemperatureConfig');

	try {
		await update(firebaseRef, {
			minTemp: minTemp,
			maxTemp: maxTemp,
			minColorTemp: minColorTemp,
			maxColorTemp: maxColorTemp,
		});
		Alert.alert('Success', 'Les paramètres ont été sauvegardés avec succès.!');
		console.log('Les paramètres ont été sauvegardés avec succès.!');
	} catch (error) {
		console.error('Error sending data:', error);
	}
};