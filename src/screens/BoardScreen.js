import { View, Text, StyleSheet } from 'react-native';

export default function BoardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>게시판</Text>
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
