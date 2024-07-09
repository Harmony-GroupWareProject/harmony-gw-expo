import * as SecureStore from 'expo-secure-store';
import { ip } from './global-variable';

export const fetchScheduleList = async () => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken');
    const empNo = await SecureStore.getItemAsync('empNo');
    console.log(userToken);
    const response = await fetch(
      `http://${ip}:9000/personalScheduleList?empNo=${empNo}`,
      {
        headers: {
          Authorization: userToken,
        },
      }
    );

    const data = await response.json();
    console.log(data);
    return Promise.resolve(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const fetchSaveSchedule = async newEvent => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken');
    const empNo = await SecureStore.getItemAsync('empNo');
    console.log(userToken);

    // POST 요청을 위해 fetch 호출을 수정합니다.
    const response = await fetch(`http://${ip}:9000/scheduleSave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken,
      },
      body: JSON.stringify({ ...newEvent, empNo: empNo, scheduleType: 2 }), // newEvent를 요청 본문에 포함시킵니다.
    });

    const data = await response.json();
    console.log(data);
    return Promise.resolve(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return Promise.reject(error);
  }
};

export const fetchUpdateSchedule = async updateEvent => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken');
    console.log(userToken);

    // POST 요청을 위해 fetch 호출을 수정합니다.
    const response = await fetch(`http://${ip}:9000/scheduleUpdate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken,
      },
      body: JSON.stringify(updateEvent), // newEvent를 요청 본문에 포함시킵니다.
    });

    const data = await response.json();
    console.log(data);
    return Promise.resolve(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return Promise.reject(error);
  }
};

export const fetchDeleteSchedule = async scheduleIdx => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken');
    console.log(userToken);

    // DELETE 요청을 위해 fetch 호출을 수정합니다.
    const response = await fetch(`http://${ip}:9000/scheduleDelete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken,
      },
      body: JSON.stringify(scheduleIdx),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return Promise.resolve(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return Promise.reject(error);
  }
};
