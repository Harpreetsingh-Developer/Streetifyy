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

const RegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Phone validation
    if (!phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
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

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle registration
  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      dispatch(setLoading(true));

      // TODO: Implement Firebase authentication and user creation
      // const response = await createUserWithEmailAndPassword(auth, email, password);
      // const userData = {
      //   id: response.user.uid,
      //   name,
      //   email,
      //   phone,
      //   addresses: [],
      //   following: [],
      //   followers: [],
      // };
      // await createUserProfile(userData);
      // dispatch(setUser(userData));

      // Temporary mock registration
      setTimeout(() => {
        dispatch(
          setUser({
            id: '1',
            name,
            email,
            phone,
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
      <Header title="Create Account" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Join Streetify</Text>
          <Text style={styles.subtitle}>
            Create an account to start your food adventure
          </Text>

          <View style={styles.form}>
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              error={errors.name}
              leftIcon="person-outline"
            />

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
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              error={errors.phone}
              keyboardType="phone-pad"
              leftIcon="call-outline"
            />

            <TextInput
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <TextInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              style={styles.registerButton}
              loading={isLoading}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <Loading visible={isLoading} message="Creating your account..." />
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
  registerButton: {
    marginTop: SIZES.padding,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  loginText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  loginLink: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;