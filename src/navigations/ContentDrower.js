import { createDrawerNavigator } from '@react-navigation/drawer';
import { ContentRoutes } from './routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from '../colors';
import DocumentScreen from '../screens/DocumentScreen'; // 오타 수정: DocumnetScreen -> DocumentScreen
import NoticeScreen from '../screens/NoticeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import HomeScreen from '../screens/HomeScreen';
import OrgChartStack from './OrgChartStack';

const Drawer = createDrawerNavigator();

const getDrawerIcon = ({ focused, color, size, name }) => {
  const iconName = focused ? name : `${name}-outline`;
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};

const ContentDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: PRIMARY.DARK,
        drawerInactiveTintColor: GRAY.DARK,
      }}
    >
      <Drawer.Screen
        name={ContentRoutes.HOME}
        component={HomeScreen}
        options={{
          drawerIcon: props => getDrawerIcon({ ...props, name: 'home' }),
        }}
      />
      <Drawer.Screen
        name={ContentRoutes.BOARD}
        component={NoticeScreen}
        options={{
          drawerIcon: props => getDrawerIcon({ ...props, name: 'clipboard' }), // 아이콘 이름 변경
        }}
      />
      <Drawer.Screen
        name={ContentRoutes.DOCUMENT}
        component={DocumentScreen}
        options={{
          drawerIcon: props =>
            getDrawerIcon({ ...props, name: 'file-document' }), // 아이콘 이름 변경
        }}
      />
      <Drawer.Screen
        name={ContentRoutes.SCHEDULE}
        component={ScheduleScreen}
        options={{
          drawerIcon: props => getDrawerIcon({ ...props, name: 'calendar' }), // 아이콘 이름 변경
        }}
      />
      <Drawer.Screen
        name={ContentRoutes.ORGCHART}
        component={OrgChartStack}
        options={{
          drawerIcon: props =>
            getDrawerIcon({ ...props, name: 'account-group' }), // 아이콘 이름 변경
        }}
      />
    </Drawer.Navigator>
  );
};

export default ContentDrawer;
