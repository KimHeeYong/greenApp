import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, Button, useColorScheme, View, Dimensions } from 'react-native';
import axios from 'axios';
import Svg, { Polyline } from 'react-native-svg';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const App = (): React.JSX.Element => {
  const [points, setPoints] = useState<number[][]>([]);
  const [R, setR] = useState<string>('80');
  const [r, setr] = useState<string>('36');
  const [O, setO] = useState<string>('45');
  const { width, height } = Dimensions.get('window');
  const isDarkMode = useColorScheme() === 'dark';

  const fetchPattern = () => {
    axios.get(`http://localhost:8000/api/patterns/?R=${R}&r=${r}&O=${O}`)
      .then(response => {
        setPoints(response.data.points);
      })
      .catch(error => {
        console.error('There was an error fetching the patterns!', error);
      });
  };

  useEffect(() => {
    fetchPattern();
  }, []);

  const handleSubmit = () => {
    fetchPattern();
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <Text style={styles.title}>Spirograph Patterns</Text>
          <TextInput
            style={styles.input}
            value={R}
            onChangeText={setR}
            placeholder="R"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={r}
            onChangeText={setr}
            placeholder="r"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={O}
            onChangeText={setO}
            placeholder="O"
            keyboardType="numeric"
          />
          <Button title="Generate Pattern" onPress={handleSubmit} />
          <Svg height={500} width={500} viewBox="0 0 500 500">
            <Polyline
              points={points.map(point => `${250 + point[0]},${250 + point[1]}`).join(' ')}
              fill="none"
              stroke="black"
            />
          </Svg>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    margin: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 10,
  },
});

export default App;
