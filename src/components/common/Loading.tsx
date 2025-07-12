import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../../theme';

interface LoadingProps {
  visible: boolean;
  message?: string;
  overlay?: boolean;
  style?: ViewStyle;
  size?: 'small' | 'large';
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({
  visible,
  message,
  overlay = true,
  style,
  size = 'large',
  color = COLORS.primary,
}) => {
  if (!visible) return null;

  const LoadingContent = () => (
    <View
      style={[
        styles.container,
        overlay ? styles.overlayContainer : styles.contentContainer,
        style,
      ]}
    >
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        statusBarTranslucent
      >
        <LoadingContent />
      </Modal>
    );
  }

  return <LoadingContent />;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  contentContainer: {
    padding: SIZES.padding,
  },
  loaderContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  message: {
    ...FONTS.body3,
    color: COLORS.textDark,
    marginTop: SIZES.base,
    textAlign: 'center',
  },
});

export default Loading;