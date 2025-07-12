import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../theme';
import Button from '../../components/common/Button';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../assets/images/welcome-bg.jpg')}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Streetify</Text>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Discover Street Food Near You</Text>
        <Text style={styles.subtitle}>
          Connect with local vendors, explore authentic flavors, and share your food journey
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('Register')}
            style={styles.button}
          />
          <Button
            title="I already have an account"
            variant="outline"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight || 0,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SIZES.padding,
  },
  appName: {
    ...FONTS.largeTitle,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.white,
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: SIZES.padding * 2,
  },
  buttonContainer: {
    gap: SIZES.padding,
  },
  button: {
    marginBottom: SIZES.base,
  },
});

export default WelcomeScreen;