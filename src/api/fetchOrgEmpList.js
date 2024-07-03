import * as SecureStore from 'expo-secure-store';
import { ip } from './global-variable';

export const fetchOrgEmpList = async () => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken');
    console.log(userToken);
    const response = await fetch(`http://${ip}:9000/orgEmpList`, {
      headers: {
        Authorization: userToken,
      },
    });

    const data = await response.json();
    return Promise.resolve(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
