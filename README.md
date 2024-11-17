
# Temperature Sensor Mobile App

This React Native mobile application displays real-time temperature data from sensors, stored in Firebase Realtime Database. The app fetches the data and provides a user-friendly interface to monitor temperature trends.

## Features

- **Real-Time Temperature Display**: Fetches live temperature data from Firebase.
- **Historical Data Visualization**: Displays temperature trends over time.
- **Firebase Integration**: Uses Firebase Realtime Database to retrieve sensor data.

## Technologies

- **React Native**: For building cross-platform mobile applications.
- **Firebase Realtime Database**: For real-time data storage and retrieval.
- **Node.js (optional)**: For backend processing or data manipulation if needed.

---

## Prerequisites

- **Node.js**
- **Yarn** or **npm** 
- **React Native CLI** (for Android and iOS development)
- **Android Studio** (for building the Android APK)

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Add a Firebase Realtime Database to the project and set up the structure to store temperature data.
3. Enable Firebase authentication if needed (e.g., email/password, anonymous).


---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AhmedCha/Capteur-Temperature.git
cd temperature-sensor-app
```

### 2. Install Dependencies

Install all necessary dependencies using Yarn or npm:

```bash
npm install
```

### 3. Configure Firebase

In your project, create a `firebase.js` file in the root directory to store Firebase configuration settings:

```javascript
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
```

Replace `"YOUR_API_KEY"`, `"YOUR_AUTH_DOMAIN"`, etc., with your Firebase project’s configuration values from Firebase Console.

### 4. Run the App Locally

To run the app on your local device or emulator:

1. Start the Metro bundler:

   ```bash
   npm start
   ```

2. Then select one of the following:

- i - run on iOS
- a - run on Android

Ensure you have an Android or IOS emulator running or an Android device connected via USB with developer mode enabled.

---

## Building the Android APK

To build the app for Android and generate an APK file:

1. Generate a keystore using `"keytool -genkey -v -keystore your_key_name.keystore -alias your_key_alias -keyalg RSA -keysize 2048 -validity 10000"`
2. Place the generated keystore in `"/android/app"`
3. Go to the root directory of the project.
4. Run the following command to start the build process:

   ```bash
   cd android
   gradlew assembleRelease
   ```

5. Once the build is complete, you can find the APK at `android/app/build/outputs/apk/release/app-release.apk`.

6. To install the app:
- Copy app-release.apk to your android device and install it.
- Or connect to an android device with Debug mode enabled and run ```npm run android -- --mode="release"```
