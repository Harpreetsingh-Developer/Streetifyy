import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  style?: ViewStyle;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  rightIcon,
  onRightPress,
  style,
  transparent = false,
}) => {
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.container,
        transparent ? styles.transparentContainer : styles.solidContainer,
        style,
      ]}
    >
      <StatusBar
        barStyle={transparent ? 'light-content' : 'dark-content'}
        backgroundColor={transparent ? 'transparent' : COLORS.white}
        translucent={transparent}
      />

      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity
              style={[styles.iconButton, transparent && styles.transparentButton]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={transparent ? COLORS.white : COLORS.textDark}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text
          style={[
            styles.title,
            transparent && styles.transparentTitle,
            !showBack && styles.centerTitle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        <View style={styles.rightContainer}>
          {rightIcon && (
            <TouchableOpacity
              style={[styles.iconButton, transparent && styles.transparentButton]}
              onPress={onRightPress}
            >
              <Ionicons
                name={rightIcon}
                size={24}
                color={transparent ? COLORS.white : COLORS.textDark}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: StatusBar.currentHeight || 0,
  },
  solidContainer: {
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  transparentContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: SIZES.padding,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    ...FONTS.h4,
    flex: 1,
    textAlign: 'center',
    color: COLORS.textDark,
    marginHorizontal: SIZES.base,
  },
  centerTitle: {
    textAlign: 'center',
  },
  transparentTitle: {
    color: COLORS.white,
  },
  iconButton: {
    padding: SIZES.base,
    borderRadius: SIZES.radius,
  },
  transparentButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default Header;