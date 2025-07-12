import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput as RNTextInput,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

// Components
import Button from '../components/common/Button';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';

// Theme
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

const CreateScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cameraRef = useRef(null);

  const [mode, setMode] = useState('post'); // 'post', 'story', 'reel'
  const [mediaType, setMediaType] = useState('photo'); // 'photo', 'video'
  const [showCamera, setShowCamera] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImages([...selectedImages, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setSelectedImages([...selectedImages, photo.uri]);
        setShowCamera(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const handlePost = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Please select at least one image');
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement post creation
      // const post = await createPost({
      //   type: mode,
      //   mediaType,
      //   media: selectedImages,
      //   caption,
      // });
      // dispatch(addPost(post));
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const renderModeSelector = () => (
    <View style={styles.modeSelector}>
      {['post', 'story', 'reel'].map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.modeButton,
            mode === item && styles.activeModeButton,
          ]}
          onPress={() => setMode(item)}
        >
          <Text
            style={[
              styles.modeText,
              mode === item && styles.activeModeText,
            ]}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMediaPicker = () => (
    <View style={styles.mediaPicker}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mediaContainer}
      >
        {selectedImages.map((uri, index) => (
          <View key={index} style={styles.mediaPreview}>
            <Image source={{ uri }} style={styles.mediaImage} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() =>
                setSelectedImages(selectedImages.filter((_, i) => i !== index))
              }
            >
              <Ionicons name="close-circle" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ))}

        {selectedImages.length < 10 && (
          <View style={styles.addMediaContainer}>
            <TouchableOpacity
              style={styles.addMediaButton}
              onPress={handlePickImage}
            >
              <Ionicons
                name="images-outline"
                size={32}
                color={COLORS.primary}
              />
              <Text style={styles.addMediaText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addMediaButton}
              onPress={() => setShowCamera(true)}
            >
              <Ionicons
                name="camera-outline"
                size={32}
                color={COLORS.primary}
              />
              <Text style={styles.addMediaText}>Camera</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );

  if (loading) {
    return <Loading visible message="Creating post..." />;
  }

  if (showCamera) {
    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={styles.container}>
        <Camera style={styles.camera} ref={cameraRef} type={Camera.Constants.Type.back}>
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Ionicons name="close" size={32} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleTakePhoto}
            >
              <View style={styles.captureCircle} />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Create"
        rightIcon="checkmark"
        onRightPress={handlePost}
      />

      {renderModeSelector()}
      {renderMediaPicker()}

      <View style={styles.captionContainer}>
        <RNTextInput
          style={styles.captionInput}
          placeholder="Write a caption..."
          placeholderTextColor={COLORS.textLight}
          multiline
          value={caption}
          onChangeText={setCaption}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modeSelector: {
    flexDirection: 'row',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.base,
  },
  activeModeButton: {
    backgroundColor: COLORS.primary + '20',
  },
  modeText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  activeModeText: {
    color: COLORS.primary,
  },
  mediaPicker: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginTop: SIZES.padding,
  },
  mediaContainer: {
    gap: SIZES.padding,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  addMediaContainer: {
    flexDirection: 'row',
    gap: SIZES.padding,
  },
  addMediaButton: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMediaText: {
    ...FONTS.body3,
    color: COLORS.primary,
    marginTop: SIZES.base,
  },
  captionContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: SIZES.padding,
    padding: SIZES.padding,
  },
  captionInput: {
    ...FONTS.body2,
    color: COLORS.textDark,
    height: 100,
    textAlignVertical: 'top',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
});

export default CreateScreen;