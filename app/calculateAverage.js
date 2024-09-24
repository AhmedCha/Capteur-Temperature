import { useEffect, useState } from 'react';
import { ref, onValue, query, orderByKey, limitToLast, get, set } from "firebase/database";
import { database } from './firebase';


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

    // Cleanup function to remove the listener when the component unmounts
    return () => unsubscribe();

  }, []);

  return data; // Instead of returning an object, just return the data
};

const fetchTemperatureData = () => {
  return new Promise((resolve, reject) => {
    const temperatureRef = ref(database, "TemperatureSensorData");

    const unsubscribe = onValue(temperatureRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        resolve(data); // Resolve the promise with the data
        unsubscribe(); // Unsubscribe after fetching data once
      } else {
        reject(new Error("No data found"));
      }
    }, reject); // Handle Firebase errors
  });
};




const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

/**
 * Converts timestamp string to a Date object
 */
const parseTimestamp = (timestamp) => {
  // Assuming format "DD/MM/YYYY, HH:MM:SS"
  const [datePart, timePart] = timestamp.split(", ");
  const [day, month, year] = datePart.split("/");
  const [hours, minutes, seconds] = timePart.split(":");

  return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
};

/**
 * Filter data by time range
 */
const filterDataByTimeRange = (data, startTime, endTime) => {
  return Object.values(data).filter(item => {
    const itemTimestamp = parseTimestamp(item.timestamp).getTime();
    return itemTimestamp >= startTime && itemTimestamp <= endTime;
  });
};

/**
 * Calculate average temperature for a set of data points
 */
const calculateAverage = (data) => {
  if (data.length === 0) return 0;
  const total = data.reduce((sum, item) => sum + parseFloat(item.temperature), 0);
  return total / data.length;
};

/**
 * Format a date object to "DD/MM/YYYY, HH:MM" string
 */
const formatTimestamp = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hours}:${minutes}`;
};

/**
 * Format a date object to "DD/MM/YYYY" string (for daily averages)
 */
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


/**
 * Get averages for every hour in the past 24 hours
 */
const getHourlyAverages = (data) => {
  const now = new Date();
  now.setMinutes(0, 0, 0); // Round down to the nearest full hour (set minutes, seconds, ms to 0)

  let hourlyAverages = [];

  for (let i = 0; i < 24; i++) {
    const endTime = new Date(now.getTime() - i * ONE_HOUR); // Get the current hour
    const startTime = new Date(endTime.getTime() - ONE_HOUR); // Get the previous hour

    const hourData = filterDataByTimeRange(data, startTime.getTime(), endTime.getTime());

    const temperature = calculateAverage(hourData).toFixed(2);
    const timestamp = formatTimestamp(endTime); // Format as "DD/MM/YYYY, HH:00"

    hourlyAverages.unshift({ timestamp, temperature }); // Insert at the beginning to reverse the order
  }

  return hourlyAverages; // Array of 24 objects with "hour" and "average"
};

/**
 * Get averages for each day in the past week (7 days)
 */
const getDailyAverages = (data, days) => {
  const now = new Date().getTime();
  let dailyAverages = [];

  for (let i = 0; i < days; i++) {
    const startTime = now - (i + 1) * ONE_DAY;
    const endTime = now - i * ONE_DAY;
    const dayData = filterDataByTimeRange(data, startTime, endTime);

    const temperature = calculateAverage(dayData).toFixed(2);
    const timestamp = formatDate(new Date(endTime)); // Get the formatted date

    dailyAverages.unshift({ timestamp, temperature }); // Insert at the beginning to reverse the order
  }

  return dailyAverages; // Array of `days` objects with "date" and "average"
};


/**
 * Save the averages to Firebase with a timestamp
 */
const saveAveragesToFirebase = async (averages) => {
  const averagesRef = ref(database, "TemperatureAverages");
  const timestamp = new Date().getTime(); // Current timestamp in milliseconds
  await set(averagesRef, { ...averages, lastUpdated: timestamp });
};

/**
 * Fetch the stored averages from Firebase
 */
const fetchAveragesFromFirebase = async () => {
  const averagesRef = ref(database, "TemperatureAverages");
  const snapshot = await get(averagesRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};

/**
 * Main function to get averages, either from Firebase or by calculating
 */
export const getTemperatureAverages = async () => {
  const cachedAverages = await fetchAveragesFromFirebase();
  const now = new Date().getTime();
  console.log("time diff", ((now % ONE_HOUR) + ONE_HOUR) / 60 / 1000, (now % ONE_HOUR) > ONE_HOUR)

  // Check if cached data exists and was updated less than an hour ago
  if (cachedAverages && (now % ONE_HOUR) < ONE_HOUR) {
    return cachedAverages; // Return cached averages
  }

  const data = await fetchTemperatureData();
  // Otherwise, calculate new averages
  const last24HourAverages = getHourlyAverages(data);
  const lastWeekAverages = getDailyAverages(data, 7);
  const lastMonthAverages = getDailyAverages(data, 30);

  const averages = {
    last24HourAverages,
    lastWeekAverages,
    lastMonthAverages,
  };

  // Save newly calculated averages with the current timestamp
  await saveAveragesToFirebase(averages);

  return averages;
};