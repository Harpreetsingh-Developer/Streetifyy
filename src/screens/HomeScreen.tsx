import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

// Components
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';

// Redux actions
import { setFeed } from '../store/slices/socialSlice';
import { setNearbyVendors } from '../store/slices/vendorSlice';
import { RootState } from '../store';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: RootState) => state.user.currentUser);
  const feed = useSelector((state: RootState) => state.social.feed);
  const nearbyVendors = useSelector((state: RootState) => state.vendor.nearbyVendors);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchFeed(),
        fetchNearbyVendors(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const fetchFeed = async () => {
    // TODO: Implement feed fetching from Firebase
    // const feedData = await getFeedPosts();
    // dispatch(setFeed(feedData));

    // Temporary mock data
    const mockFeed = Array(5).fill(null).map((_, index) => ({
      id: `post-${index}`,
      creatorId: 'user1',
      type: 'post',
      media: [{
        type: 'image',
        url: 'https://picsum.photos/400/300',
      }],
      caption: 'Delicious street food! 😋',
      likes: Math.floor(Math.random() * 100),
      comments: [],
      createdAt: new Date(),
    }));
    dispatch(setFeed(mockFeed));
  };

  const fetchNearbyVendors = async () => {
    // TODO: Implement nearby vendors fetching
    // const vendors = await getNearbyVendors(userLocation, 5);
    // dispatch(setNearbyVendors(vendors));

    // Temporary mock data
    const mockVendors = Array(3).fill(null).map((_, index) => ({
      id: `vendor-${index}`,
      name: `Street Food Vendor ${index + 1}`,
      description: 'Authentic local cuisine',
      location: {
        latitude: 0,
        longitude: 0,
        address: '123 Street Food Lane',
      },
      cuisine: ['Local', 'Street Food'],
      rating: 4.5,
      totalRatings: 128,
      photos: ['https://picsum.photos/400/300'],
      menu: [],
      operatingHours: {},
      isOpen: true,
    }));
    dispatch(setNearbyVendors(mockVendors));
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={{ uri: user?.profilePic || 'https://picsum.photos/100' }}
          style={styles.profilePic}
        />
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Ionicons name="notifications-outline" size={24} color={COLORS.textDark} />
      </TouchableOpacity>
    </View>
  );

  const renderNearbyVendors = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Vendors</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={nearbyVendors}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.vendorList}
        renderItem={({ item }) => (
          <Card
            title={item.name}
            subtitle={item.description}
            image={{ uri: item.photos[0] }}
            rating={item.rating}
            tags={item.cuisine}
            onPress={() => navigation.navigate('VendorDetails', { vendorId: item.id })}
            style={styles.vendorCard}
          />
        )}
      />
    </View>
  );

  const renderFeedItem = ({ item }) => (
    <View style={styles.feedItem}>
      <View style={styles.feedHeader}>
        <Image
          source={{ uri: 'https://picsum.photos/100' }}
          style={styles.feedUserPic}
        />
        <View style={styles.feedUserInfo}>
          <Text style={styles.feedUserName}>Food Lover</Text>
          <Text style={styles.feedTime}>2 hours ago</Text>
        </View>
      </View>

      <Image
        source={{ uri: item.media[0].url }}
        style={styles.feedImage}
        resizeMode="cover"
      />

      <View style={styles.feedActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color={COLORS.textDark} />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color={COLORS.textDark} />
          <Text style={styles.actionText}>{item.comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <Text style={styles.feedCaption}>{item.caption}</Text>
    </View>
  );

  if (loading) {
    return <Loading visible message="Loading feed..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feed}
        keyExtractor={(item) => item.id}
        renderItem={renderFeedItem}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderNearbyVendors()}
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.base,
  },
  greeting: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  userName: {
    ...FONTS.h4,
    color: COLORS.textDark,
  },
  notificationButton: {
    padding: SIZES.base,
  },
  section: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textDark,
  },
  seeAllText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  vendorList: {
    paddingRight: SIZES.padding,
  },
  vendorCard: {
    width: 280,
    marginRight: SIZES.padding,
  },
  feedItem: {
    backgroundColor: COLORS.white,
    marginBottom: SIZES.padding,
    ...SHADOWS.light,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  feedUserPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.base,
  },
  feedUserInfo: {
    flex: 1,
  },
  feedUserName: {
    ...FONTS.h4,
    color: COLORS.textDark,
  },
  feedTime: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  feedImage: {
    width: '100%',
    height: 300,
  },
  feedActions: {
    flexDirection: 'row',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.padding * 2,
  },
  actionText: {
    ...FONTS.body3,
    color: COLORS.textDark,
    marginLeft: SIZES.base,
  },
  feedCaption: {
    ...FONTS.body2,
    color: COLORS.textDark,
    padding: SIZES.padding,
  },
});

export default HomeScreen;