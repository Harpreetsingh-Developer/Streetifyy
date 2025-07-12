import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../store/user/actions';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Components
import Header from '../components/common/Header';
import TextInput from '../components/common/TextInput';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

// Theme
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

// Types
import { RootState } from '../store';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.currentUser);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setLoading(true);
      await dispatch(updateUserProfile({
        name,
        email,
        phone,
        bio,
        profilePicture,
      }));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading visible message="Updating profile..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Edit Profile"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
        rightIcon="checkmark"
        onRightPress={handleSave}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageSection}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={handlePickImage}
          >
            <Image
              source={{
                uri: profilePicture || 'https://ui-avatars.com/api/?name=' + name,
              }}
              style={styles.profileImage}
            />
            <View style={styles.editImageButton}>
              <Ionicons name="camera" size={20} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            leftIcon="person-outline"
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            leftIcon="call-outline"
            keyboardType="phone-pad"
          />

          <TextInput
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            leftIcon="information-circle-outline"
            multiline
            numberOfLines={4}
            containerStyle={styles.bioInput}
          />

          <Button
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveButton}
          />
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
  profileImageSection: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  form: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    marginTop: SIZES.padding,
    ...SHADOWS.light,
  },
  bioInput: {
    height: 120,
  },
  saveButton: {
    marginTop: SIZES.padding,
  },
});

export default EditProfileScreen;