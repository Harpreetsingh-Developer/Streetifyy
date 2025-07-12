import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../theme';

// Components
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

const OTPVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    startCountdown();
    return () => clearInterval(countdownInterval.current);
  }, []);

  const countdownInterval = useRef<NodeJS.Timeout>();

  const startCountdown = () => {
    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);

    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) {
      setError('Please enter the complete verification code');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // TODO: Implement OTP verification logic
      // await verifyPhoneNumber(phoneNumber, otpString);

      // Temporary mock verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to the next screen or handle successful verification
      navigation.navigate('Login');

    } catch (error) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      setIsLoading(true);
      setError('');

      // TODO: Implement resend OTP logic
      // await sendOTP(phoneNumber);

      // Temporary mock resend
      await new Promise(resolve => setTimeout(resolve, 1000));

      startCountdown();
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Verify Phone" />

      <View style={styles.content}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to {phoneNumber}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref!)}
              style={[styles.otpInput, error && styles.otpInputError]}
              value={digit}
              onChangeText={(text) => handleOtpChange(text.slice(-1), index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <Text style={styles.helperText}>
            Didn't receive the code? {canResend ? (
              <TouchableOpacity onPress={handleResendOTP}>
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            ) : (
              <Text>Resend in {countdown}s</Text>
            )}
          </Text>
        )}

        <Button
          title="Verify"
          onPress={handleVerifyOTP}
          style={styles.verifyButton}
          loading={isLoading}
        />
      </View>

      <Loading visible={isLoading} message="Verifying..." />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    alignItems: 'center',
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    textAlign: 'center',
    fontSize: SIZES.h3,
    color: COLORS.textDark,
  },
  otpInputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...FONTS.body3,
    color: COLORS.error,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  helperText: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  resendText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  verifyButton: {
    width: '100%',
    marginTop: SIZES.padding,
  },
});

export default OTPVerificationScreen;