import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrgChartScreen from '../screens/OrgChartScreen'; // 경로는 실제 경로에 맞게 조정
import EmpDetailScreen from '../screens/EmpDetailScreen'; // 경로는 실제 경로에 맞게 조정

const Stack = createNativeStackNavigator();

const OrgChartStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrgChart"
        component={OrgChartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmpDetail"
        component={EmpDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default OrgChartStack;
