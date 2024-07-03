import * as SecureStore from 'expo-secure-store';
import { ip } from './global-variable';

export const signIn = async (empNo, password) => {
  try {
    const response = await fetch(`http://${ip}:9000/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ empNo, password }),
    });

    if (response.ok) {
      const token = response.headers
        .get('Authorization')
        .replace('Bearer ', '');

      // 토큰을 SecureStore에 저장
      await SecureStore.setItemAsync('userToken', token);
      // 사용자 이름을 SecureStore에 저장
      await SecureStore.setItemAsync('empNo', empNo);

      // 메인 화면으로 이동
      return Promise.resolve(empNo);
    } else {
      return Promise.reject('로그인 실패');
    }
  } catch (error) {
    return Promise.reject('로그인 중 오류가 발생했습니다.');
  }
};
