
import {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { apiClient } from './src/api/apiClient';


function App() {
  const [message, setMessage] = useState('Connecting to backend...');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await apiClient.get('/health');
        setMessage(response.data.message);
      } catch {
        setMessage('Backend connection failed');
      }
    };

    checkBackend();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text>{message}</Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
