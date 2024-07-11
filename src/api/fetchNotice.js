import * as SecureStore from 'expo-secure-store';
import { ip } from './global-variable';

export const fetchNoticeList = async (page, size) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken');
    const response = await fetch(
      `http://${ip}:9000/notice/list?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: userToken,
        },
      }
    );
    const data = await response.json();
    return Promise.resolve(data);
  } catch (error) {
    console.error('Error fetching notices:', error);
  }
};
