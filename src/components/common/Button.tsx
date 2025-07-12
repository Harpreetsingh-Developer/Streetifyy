import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: SIZES.radius,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };

    // Size variations
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = SIZES.base;
        baseStyle.paddingHorizontal = SIZES.padding;
        break;
      case 'large':
        baseStyle.paddingVertical = SIZES.padding;
        baseStyle.paddingHorizontal = SIZES.padding * 2;
        break;
      default: // medium
        baseStyle.paddingVertical = SIZES.padding / 1.5;
        baseStyle.paddingHorizontal = SIZES.padding * 1.5;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = COLORS.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = COLORS.primary;
        break;
      case 'text':
        baseStyle.backgroundColor = 'transparent';
        break;
      default: // primary
        baseStyle.backgroundColor = COLORS.primary;
    }

    // Disabled state
    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...FONTS.body2,
      textAlign: 'center',
    };

    // Size variations
    switch (size) {
      case 'small':
        baseStyle.fontSize = SIZES.body3;
        break;
      case 'large':
        baseStyle.fontSize = SIZES.h4;
        break;
      default: // medium
        baseStyle.fontSize = SIZES.body2;
    }

    // Variant styles
    switch (variant) {
      case 'outline':
      case 'text':
        baseStyle.color = COLORS.primary;
        break;
      default: // primary, secondary
        baseStyle.color = COLORS.white;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyles(), style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'text' ? COLORS.primary : COLORS.white}
          style={styles.loader}
        />
      ) : (
        <Text style={[getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  loader: {
    marginRight: SIZES.base,
  },
});

export default Button;