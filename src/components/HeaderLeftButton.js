import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

const HeaderLeftButton = ({ tintColor }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
      <MaterialCommunityIcons name="menu" size={24} color={tintColor} />
    </TouchableOpacity>
  );
};

HeaderLeftButton.propTypes = {
  tintColor: PropTypes.string,
};

export default HeaderLeftButton;
