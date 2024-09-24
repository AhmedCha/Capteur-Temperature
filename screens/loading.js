import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import useDynamicStyles from '../assets/styles/styles'


function LoadingScreen() {
  const styles = useDynamicStyles();
	return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007BFF" />
      <Text style={styles.loadingText}>Chargement...</Text>
    </View>
  )
}
export default LoadingScreen;