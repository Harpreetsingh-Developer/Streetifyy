import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme';

interface CardProps {
  title: string;
  subtitle?: string;
  image: ImageSourcePropType;
  rating?: number;
  price?: string;
  distance?: string;
  duration?: string;
  tags?: string[];
  onPress?: () => void;
  style?: ViewStyle;
  favorite?: boolean;
  onFavoritePress?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  image,
  rating,
  price,
  distance,
  duration,
  tags,
  onPress,
  style,
  favorite,
  onFavoritePress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
        {onFavoritePress && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onFavoritePress}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={24}
              color={favorite ? COLORS.primary : COLORS.white}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={COLORS.warning} />
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}

        {tags && tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footerContainer}>
          {price && (
            <View style={styles.infoContainer}>
              <Ionicons name="pricetag-outline" size={16} color={COLORS.gray} />
              <Text style={styles.infoText}>{price}</Text>
            </View>
          )}

          {distance && (
            <View style={styles.infoContainer}>
              <Ionicons name="location-outline" size={16} color={COLORS.gray} />
              <Text style={styles.infoText}>{distance}</Text>
            </View>
          )}

          {duration && (
            <View style={styles.infoContainer}>
              <Ionicons name="time-outline" size={16} color={COLORS.gray} />
              <Text style={styles.infoText}>{duration}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    ...SHADOWS.medium,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
  },
  favoriteButton: {
    position: 'absolute',
    top: SIZES.padding,
    right: SIZES.padding,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: SIZES.radius,
    padding: SIZES.base,
  },
  contentContainer: {
    padding: SIZES.padding,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  title: {
    ...FONTS.h3,
    flex: 1,
    marginRight: SIZES.base,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...FONTS.body3,
    color: COLORS.textDark,
    marginLeft: 4,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.base,
  },
  tag: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    marginRight: SIZES.base,
    marginBottom: 4,
  },
  tagText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  infoText: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginLeft: 4,
  },
});

export default Card;