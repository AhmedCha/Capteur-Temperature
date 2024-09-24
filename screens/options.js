import React, { useEffect, useState } from 'react';
import { Text, TextInput, Button, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { firebaseConfigData, updateFirebaseConfigData } from '../app/firebaseData';
import useDynamicStyles from '../assets/styles/styles'
import LoadingScreen from './loading'

// Increment/decrement input value
const NumberInput = ({ value, onChange, min, max }) => {
  const styles = useDynamicStyles();
  const [inputValue, setInputValue] = useState(value !== null ? value : 0);

  const parseValue = (val) => {
    const parsed = parseInt(val.toString().replace(/\s/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  const incrementValue = () => {
    const newValue = parseValue(inputValue) + 1;
    if (newValue <= max) {
      setInputValue(newValue);
      onChange(newValue);
    }
  };

  const decrementValue = () => {
    const newValue = parseValue(inputValue) - 1;
    if (newValue >= min) {
      setInputValue(newValue);
      onChange(newValue);
    }
  };

  const handleChangeText = (text) => {
    const newValue = parseValue(text);
    setInputValue(newValue);
  };

  const handleBlur = () => {
    const newValue = parseValue(inputValue);
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    } else {
      setInputValue(value);
    }
  };

  return (
    <View style={[styles.container, { flexDirection: 'row', alignItems: 'center' }]}>
      <TouchableOpacity onPress={decrementValue}>
        <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold' }]}> - </Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        value={inputValue.toString()}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={incrementValue}>
        <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold' }]}> + </Text>
      </TouchableOpacity>
    </View>
  );
};

/* Main Function */
function SettingsScreen() {
  const styles = useDynamicStyles();
  const [minTemp, setMinTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [minColorTemp, setMinColorTemp] = useState(null);
  const [maxColorTemp, setMaxColorTemp] = useState(null);
  const tempConfig = firebaseConfigData().tempConfig;

  useEffect(() => {
    if (tempConfig.length > 0) {
      setMinTemp(parseInt(tempConfig[0].minTemp));
      setMaxTemp(parseInt(tempConfig[0].maxTemp));
      setMinColorTemp(parseInt(tempConfig[0].minColorTemp));
      setMaxColorTemp(parseInt(tempConfig[0].maxColorTemp));
    }
  }, [tempConfig]);

  const changeMinTemp = (newValue) => setMinTemp(newValue);
  const changeMaxTemp = (newValue) => setMaxTemp(newValue);
  const changeMinTempColor = (newValue) => setMinColorTemp(newValue);
  const changeMaxTempColor = (newValue) => setMaxColorTemp(newValue);

  const handleUpdateData = () => {
    updateFirebaseConfigData(minTemp, maxTemp, minColorTemp, maxColorTemp)
  }

  /* Loading Screen */
  if (minTemp === null || maxTemp === null || minColorTemp === null || maxColorTemp === null) {
    return (
      <View style={styles.LoadingContainer}>
        <LoadingScreen />
      </View>
    )
  }
  return (
    <ScrollView style={[styles.contentContainer, paddingBottom = 20]}>
      <View>
        {/* Notifications Min/Max */}
        <View style={[styles.container, paddingBottom = 20]}>
          <Text style={styles.title}>Notifications:</Text>
          <Text style={styles.fadedText}>
            Changer les valeurs minimales et maximale pour la temperature.
          </Text>
        </View>
        <View style={[styles.container, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={styles.text}>Temperature minimale:</Text>
          <NumberInput value={minTemp} onChange={changeMinTemp} min={-55} max={maxTemp - 1} />
        </View>
        <View style={[styles.container, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={styles.text}>Temperature maximale:</Text>
          <NumberInput value={maxTemp} onChange={changeMaxTemp} min={minTemp + 1} max={125} />
        </View>
        {/* End Notifications Min/Max */}

        {/* Dashboard image color */}
        <View style={styles.container}>
          <Text style={styles.title}>Customisation:</Text>
          <Text style={styles.fadedText}>
            En changeant ces valeurs, vous déterminez la plage de températures que vous souhaitez représenter de bleu vert le rouge.
          </Text>
        </View>
        <View style={[styles.container, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={styles.text}>Temperature minimale:</Text>
          <NumberInput value={minColorTemp} onChange={changeMinTempColor} min={-55} max={maxColorTemp - 1} />
        </View>
        <View style={[styles.container, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={styles.text}>Temperature maximale:</Text>
          <NumberInput value={maxColorTemp} onChange={changeMaxTempColor} min={minColorTemp + 1} max={125} />
        </View>
      </View>
      {/* End Dashboard image color */}

      <Button
        onPress={handleUpdateData}
        title="Sauvgarder"
        color="#841584"
      />
      <View style={{ paddingBottom: 40 }}></View>
    </ScrollView>
  );
}

export default SettingsScreen;
