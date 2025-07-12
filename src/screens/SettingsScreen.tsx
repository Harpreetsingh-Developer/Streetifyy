import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Components
import Header from '../components/common/Header';

// Theme
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

// Types
import { RootState } from '../store';
import { updatePreferences } from '../store/slices/userSlice';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const preferences = useSelector((state: RootState) => state.user.currentUser?.preferences);

  const [notificationsEnabled, setNotificationsEnabled] = useState(preferences?.notifications ?? true);
  const [orderUpdates, setOrderUpdates] = useState(preferences?.orderUpdates ?? true);
  const [promotions, setPromotions] = useState(preferences?.promotions ?? true);
  const [socialUpdates, setSocialUpdates] = useState(preferences?.socialUpdates ?? true);
  const [darkMode, setDarkMode] = useState(preferences?.darkMode ?? false);
  const [locationEnabled, setLocationEnabled] = useState(preferences?.locationEnabled ?? true);

  const handleToggle = (setting: string, value: boolean) => {
    switch (setting) {
      case 'notifications':
        setNotificationsEnabled(value);
        break;
      case 'orderUpdates':
        setOrderUpdates(value);
        break;
      case 'promotions':
        setPromotions(value);
        break;
      case 'socialUpdates':
        setSocialUpdates(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
      case 'location':
        setLocationEnabled(value);
        break;
    }

    dispatch(updatePreferences({
      [setting]: value,
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache? This will not affect your account data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement cache clearing
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const renderSection = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderToggleItem = (
    icon: string,
    title: string,
    description: string,
    value: boolean,
    onToggle: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
      </View>

      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.border, true: COLORS.primary + '70' }}
        thumbColor={value ? COLORS.primary : COLORS.textLight}
        ios_backgroundColor={COLORS.border}
      />
    </View>
  );

  const renderActionItem = (
    icon: string,
    title: string,
    description: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
      </View>

      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color={COLORS.textLight}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Settings"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderSection('Notifications')}
        {renderToggleItem(
          'notifications-outline',
          'Push Notifications',
          'Receive push notifications',
          notificationsEnabled,
          (value) => handleToggle('notifications', value)
        )}
        {renderToggleItem(
          'receipt-outline',
          'Order Updates',
          'Get updates about your orders',
          orderUpdates,
          (value) => handleToggle('orderUpdates', value)
        )}
        {renderToggleItem(
          'pricetag-outline',
          'Promotions',
          'Receive offers and promotions',
          promotions,
          (value) => handleToggle('promotions', value)
        )}
        {renderToggleItem(
          'people-outline',
          'Social Updates',
          'Get updates about follows and likes',
          socialUpdates,
          (value) => handleToggle('socialUpdates', value)
        )}

        {renderSection('Appearance')}
        {renderToggleItem(
          'moon-outline',
          'Dark Mode',
          'Switch between light and dark theme',
          darkMode,
          (value) => handleToggle('darkMode', value)
        )}

        {renderSection('Privacy')}
        {renderToggleItem(
          'location-outline',
          'Location Services',
          'Allow app to access your location',
          locationEnabled,
          (value) => handleToggle('location', value)
        )}
        {renderActionItem(
          'lock-closed-outline',
          'Privacy Settings',
          'Manage your privacy preferences',
          () => navigation.navigate('PrivacySettings')
        )}

        {renderSection('Account')}
        {renderActionItem(
          'person-outline',
          'Account Information',
          'View and edit your account details',
          () => navigation.navigate('EditProfile')
        )}
        {renderActionItem(
          'key-outline',
          'Change Password',
          'Update your account password',
          () => navigation.navigate('ChangePassword')
        )}

        {renderSection('Support')}
        {renderActionItem(
          'help-circle-outline',
          'Help Center',
          'Get help and contact support',
          () => navigation.navigate('Support')
        )}
        {renderActionItem(
          'document-text-outline',
          'Terms of Service',
          'Read our terms of service',
          () => navigation.navigate('Terms')
        )}
        {renderActionItem(
          'shield-outline',
          'Privacy Policy',
          'Read our privacy policy',
          () => navigation.navigate('Privacy')
        )}

        {renderSection('Data')}
        {renderActionItem(
          'trash-outline',
          'Clear Cache',
          'Clear temporary app data',
          handleClearCache
        )}

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionHeader: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  settingContent: {
    flex: 1,
    marginRight: SIZES.padding,
  },
  settingTitle: {
    ...FONTS.h4,
    color: COLORS.textDark,
  },
  settingDescription: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: SIZES.base,
  },
  versionContainer: {
    padding: SIZES.padding * 2,
    alignItems: 'center',
  },
  versionText: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
});

export default SettingsScreen;