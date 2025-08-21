import { StyleSheet, View, Text } from 'react-native';
import DetectObject from './src/index.js';

export default function App() {
  return (
    <View style={styles.container}>
      <DetectObject />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});
