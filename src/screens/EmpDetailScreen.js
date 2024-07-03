import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const EmpDetailScreen = ({ route }) => {
  const { empData } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Details</Text>
      <Text>Name: {empData.empName}</Text>
      <Text>Position: {empData.position}</Text>
      <Text>Employee No: {empData.empNo}</Text>
      {/* 필요한 경우 추가 정보를 표시할 수 있습니다 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
EmpDetailScreen.propTypes = {
  route: PropTypes.object,
};
export default EmpDetailScreen;
