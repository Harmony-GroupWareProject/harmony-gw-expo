import { View, Text, StyleSheet } from 'react-native';

export default function DocumnetScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>문서</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
});
