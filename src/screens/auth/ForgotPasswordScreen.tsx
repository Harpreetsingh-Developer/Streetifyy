import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../theme';

// Components
import Header from '../../components/common/Header';
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    try {
      setIsLoading(true);
      setError('');

      // TODO: Implement password reset logic
      // await sendPasswordResetEmail(auth, email);

      // Temporary mock reset
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsEmailSent(true);
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Reset Password" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {!isEmailSent ? (
            <>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you instructions to reset your
                password.
              </Text>

              <View style={styles.form}>
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  error={error}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="mail-outline"
                />

                <Button
                  title="Send Reset Link"
                  onPress={handleResetPassword}
                  style={styles.resetButton}
                  loading={isLoading}
                />

                <Button
                  title="Back to Login"
                  variant="outline"
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                />
              </View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent password reset instructions to:
              </Text>
              <Text style={styles.emailText}>{email}</Text>
              <Text style={styles.helperText}>
                Please check your email and follow the instructions to reset your
                password. The link will expire in 1 hour.
              </Text>

              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                style={styles.backButton}
              />

              <Button
                title="Resend Email"
                variant="outline"
                onPress={handleResetPassword}
                style={styles.resendButton}
                loading={isLoading}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <Loading visible={isLoading} message="Sending reset instructions..." />
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
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginBottom: SIZES.padding * 2,
    textAlign: 'center',
  },
  form: {
    gap: SIZES.padding,
  },
  resetButton: {
    marginTop: SIZES.padding,
  },
  backButton: {
    marginTop: SIZES.base,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  emailText: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginVertical: SIZES.padding,
  },
  helperText: {
    ...FONTS.body3,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
  },
  resendButton: {
    marginTop: SIZES.base,
  },
});

export default ForgotPasswordScreen;