import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Components
import Header from '../components/common/Header';
import Button from '../components/common/Button';

// Theme
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

// Types
import { RootState } from '../store';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.currentUser);
  const userPosts = useSelector((state: RootState) => state.social.userPosts);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement logout
            // await auth.signOut();
            // dispatch(clearUserData());
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri: user?.profilePicture ||
              'https://ui-avatars.com/api/?name=' + user?.name,
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity
          style={styles.editImageButton}
          onPress={() => {
            // TODO: Implement image picker
          }}
        >
          <Ionicons name="camera" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <Text style={styles.userName}>{user?.name}</Text>
      <Text style={styles.userBio}>{user?.bio || 'No bio added yet'}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userPosts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user?.following?.length || 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user?.followers?.length || 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
      </View>

      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate('EditProfile')}
        variant="outline"
        style={styles.editButton}
      />
    </View>
  );

  const renderMenuItem = (
    icon: string,
    title: string,
    onPress: () => void,
    showBadge?: boolean
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={24} color={COLORS.textDark} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <View style={styles.menuRight}>
        {showBadge && <View style={styles.badge} />}
        <Ionicons
          name="chevron-forward"
          size={24}
          color={COLORS.textLight}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Profile"
        rightIcon="settings-outline"
        onRightPress={() => navigation.navigate('Settings')}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}

        <View style={styles.section}>
          {renderMenuItem(
            'bookmark-outline',
            'Saved Items',
            () => navigation.navigate('SavedItems')
          )}
          {renderMenuItem(
            'notifications-outline',
            'Notifications',
            () => navigation.navigate('Notifications'),
            true
          )}
          {renderMenuItem(
            'location-outline',
            'Addresses',
            () => navigation.navigate('Addresses')
          )}
          {renderMenuItem(
            'card-outline',
            'Payment Methods',
            () => navigation.navigate('PaymentMethods')
          )}
          {renderMenuItem(
            'heart-outline',
            'Favorite Vendors',
            () => navigation.navigate('FavoriteVendors')
          )}
        </View>

        <View style={styles.section}>
          {renderMenuItem(
            'help-circle-outline',
            'Help & Support',
            () => navigation.navigate('Support')
          )}
          {renderMenuItem(
            'information-circle-outline',
            'About Us',
            () => navigation.navigate('About')
          )}
          {renderMenuItem(
            'log-out-outline',
            'Logout',
            handleLogout
          )}
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
  profileHeader: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 2,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: SIZES.padding,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    padding: SIZES.base,
    borderRadius: 15,
    ...SHADOWS.light,
  },
  userName: {
    ...FONTS.h2,
    color: COLORS.textDark,
    marginBottom: SIZES.base,
  },
  userBio: {
    ...FONTS.body3,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: SIZES.padding,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...FONTS.h3,
    color: COLORS.textDark,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  editButton: {
    width: '50%',
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: SIZES.padding,
    ...SHADOWS.light,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    width: 32,
    alignItems: 'center',
  },
  menuTitle: {
    ...FONTS.body2,
    color: COLORS.textDark,
    flex: 1,
    marginLeft: SIZES.padding,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: SIZES.padding,
  },
});

export default ProfileScreen;