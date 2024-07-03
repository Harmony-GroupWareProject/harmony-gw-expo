import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘 일정</Text>
      {/* 오늘 일정 내용 추가 */}
      <Text style={styles.title}>공지 사항</Text>
      {/* 공지 사항 내용 추가 */}
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
