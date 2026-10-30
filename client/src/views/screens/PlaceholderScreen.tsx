
import {StyleSheet, Text, View} from 'react-native';

type PlaceholderScreenProps = {
  title: string;
};

const PlaceholderScreen = ({title}: PlaceholderScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9F7',
  },
  title: {
    color: '#20392E',
    fontSize: 24,
    fontWeight: '700',
  },
});

export default PlaceholderScreen;
