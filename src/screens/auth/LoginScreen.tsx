import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { COLORS, FONTS, SIZES } from '../../theme';

// Components
import Header from '../../components/common/Header';
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

// Redux actions
import { setUser, setLoading, setError } from '../../store/slices/userSlice';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
    };

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      dispatch(setLoading(true));

      // TODO: Implement Firebase authentication
      // const response = await signInWithEmailAndPassword(auth, email, password);
      // const userData = await fetchUserData(response.user.uid);
      // dispatch(setUser(userData));

      // Temporary mock login
      setTimeout(() => {
        dispatch(
          setUser({
            id: '1',
            name: 'John Doe',
            email: email,
            addresses: [],
            following: [],
            followers: [],
          })
        );
        setIsLoading(false);
        dispatch(setLoading(false));
      }, 1500);

    } catch (error) {
      setIsLoading(false);
      dispatch(setLoading(false));
      dispatch(setError(error.message));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Login" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Sign in to continue your food journey
          </Text>

          <View style={styles.form}>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />

            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Login"
              onPress={handleLogin}
              style={styles.loginButton}
              loading={isLoading}
            />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <Loading visible={isLoading} message="Logging in..." />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.textDark,
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginBottom: SIZES.padding * 2,
  },
  form: {
    gap: SIZES.padding,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -SIZES.padding / 2,
  },
  forgotPasswordText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  loginButton: {
    marginTop: SIZES.padding,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  signupText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  signupLink: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;