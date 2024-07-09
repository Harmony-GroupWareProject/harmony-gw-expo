import { Alert, Image, StyleSheet, View, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Input, { IconNames, ReturnKeyTypes } from '../components/Input';
import SafeInputView from '../components/SafeInputView';
import { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import { signIn } from '../api/auth';
import { useUserContext } from '../contexts/UserContext';

const SignInScreen = () => {
  const insets = useSafeAreaInsets();

  const { setUser } = useUserContext();

  const [empNo, setEmpNo] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDisabled(!empNo || !password);
  }, [empNo, password]);

  const onSubmit = async () => {
    if (!isLoading && !disabled) {
      if (empNo === '' || password === '') {
        Alert.alert('사원번호, 비빌번호를 입력해주세요');
      } else {
        try {
          setIsLoading(true);
          Keyboard.dismiss();
          const data = await signIn(empNo, password);
          setIsLoading(false);
          setUser(data);
        } catch (error) {
          Alert.alert('로그인 실패', error, [
            { text: '확인', onPress: () => setIsLoading(false) },
          ]);
        }
      }
    }
  };

  return (
    <SafeInputView>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Image
          source={require('../../assets/login.png')}
          style={styles.image}
        />

        <Input
          title={'사원번호'}
          placeholder="사원번호"
          returnKeyType={ReturnKeyTypes.NEXT}
          value={empNo}
          onChangeText={empNo => setEmpNo(empNo.trim())}
          iconName={IconNames.EMPNO}
          onSubmitEditing={() => passwordRef.current.focus()}
        />
        <Input
          ref={passwordRef}
          title={'비밀번호'}
          returnKeyType={ReturnKeyTypes.DONE}
          secureTextEntry
          value={password}
          onChangeText={password => setPassword(password.trim())}
          iconName={IconNames.PASSWORD}
          onSubmitEditing={onSubmit}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="로그인"
            onPress={onSubmit}
            disabled={disabled}
            isLoading={isLoading}
          />
        </View>
      </View>
    </SafeInputView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 20,
  },
});

export default SignInScreen;
