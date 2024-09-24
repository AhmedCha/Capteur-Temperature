import { StyleSheet, useColorScheme } from 'react-native';

// Function to determine color scheme and apply styles dynamically
const getStyles = (colorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF', // Dark/Light mode background
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: colorScheme === 'dark' ? '#1F1F1F' : '#F5F5F5', // Background color based on scheme
  },
  LoadingContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: colorScheme === 'dark' ? '#1F1F1F' : '#F5F5F5', // Background color based on scheme
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000', // Text color based on scheme
  },
  text: {
    fontSize: 18,
    marginBottom: 12,
    color: colorScheme === 'dark' ? '#E0E0E0' : '#333333', // Text color based on scheme
  },
  fadedText: {
    fontSize: 14,
    color: colorScheme === 'dark' ? '#B0B0B0' : 'gray', // Faded text color
    marginBottom: 8,
  },
  input: {
    height: 48,
    width: 50,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#FFFFFF', // Input background color
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000', // Input text color
  },
  numberInput: {
    textAlign: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 10,
    backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#FFFFFF', // Number input background color
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000', // Number input text color
  },
  successBox: {
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginBottom: 20,
  },
  successText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  parentContainer: {
    flex: 1, 
    backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF', // Parent container background color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginLeft: 12,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#333333', // Loading text color based on scheme
  },
  dropdownContainer: {
    marginTop: 20,
    width: '100%',
  },
  picker: {
    height: 48,
    width: '100%',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#FFFFFF', // Picker background color
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000', // Picker text color
  },
  labelStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  },
});

// Use hook to apply styles in the component
const useDynamicStyles = () => {
  const colorScheme = useColorScheme(); // Get the current color scheme (light/dark)
  return getStyles(colorScheme);
};

export default useDynamicStyles;
