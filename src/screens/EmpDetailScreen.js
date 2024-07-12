import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  NativeModules,
} from 'react-native';
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome6,
  Feather,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

const { ContactModule } = NativeModules;

const EmpDetailScreen = ({ route }) => {
  const { empData } = route.params;
  const navigation = useNavigation();
  // 전화 걸기 함수
  const makePhoneCall = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // 문자 보내기 함수
  const sendMessage = phoneNumber => {
    Linking.openURL(`sms:${phoneNumber}`);
  };

  const openAddContactScreen = () => {
    ContactModule.addContact(
      empData.empName,
      empData.phoneNum,
      empData.email,
      empData.orgName,
      empData.position
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="orange" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <MaterialCommunityIcons name="account-box" size={150} color="orange" />
        <Text style={styles.name}>{empData.empName}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => makePhoneCall(empData.phoneNum)}
        >
          <FontAwesome6 name="phone" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => sendMessage(empData.phoneNum)}
        >
          <MaterialCommunityIcons name="message" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={openAddContactScreen}
        >
          <Feather name="share" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>전화번호</Text>
        <View style={styles.infoRow}>
          <FontAwesome6 name="square-phone" size={24} color="orange" />
          <Text style={styles.infoText}>{empData.phoneNum}</Text>
        </View>
        <Text style={styles.title}>이메일</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={24} color="orange" />
          <Text style={styles.infoText}>{empData.email}</Text>
        </View>
        <Text style={styles.title}>부서</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="work" size={24} color="orange" />
          <Text style={styles.infoText}>{empData.orgName}</Text>
        </View>
        <Text style={styles.title}>직책</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="work" size={24} color="orange" />
          <Text style={styles.infoText}>{empData.position}</Text>
        </View>
        <Text style={styles.title}>입사날짜</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="calendar" size={24} color="orange" />
          <Text style={styles.infoText}>{empData.hireDate}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  phone: {
    color: 'black',
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconButton: {
    backgroundColor: 'orange',
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
  },
  infoContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoRowContainer: {
    width: '100%',
    marginVertical: 10,
  },
  title: {
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
  },
});

EmpDetailScreen.propTypes = {
  route: PropTypes.object,
};

export default EmpDetailScreen;
