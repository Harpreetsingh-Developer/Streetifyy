import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Components
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

// Theme
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

// Types
import { RootState } from '../store';
import { MenuItem } from '../types';

const HEADER_MAX_HEIGHT = 250;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const VendorDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const scrollY = new Animated.Value(0);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'reviews', 'info'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const vendor = useSelector((state: RootState) =>
    state.vendor.vendors.find((v) => v.id === route.params?.vendorId)
  );

  const cart = useSelector((state: RootState) => state.order.cart);

  useEffect(() => {
    if (!vendor) {
      // TODO: Fetch vendor details
      // dispatch(fetchVendorDetails(route.params?.vendorId));
    }
  }, [vendor, route.params?.vendorId]);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const headerImageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const renderHeader = () => (
    <Animated.View style={[styles.header, { height: headerHeight }]}>
      <Animated.Image
        source={{ uri: vendor?.photos[0] }}
        style={[styles.headerImage, { opacity: headerImageOpacity }]}
      />
      <Animated.View
        style={[
          styles.headerContent,
          { opacity: headerTitleOpacity },
        ]}
      >
        <Text style={styles.headerTitle}>{vendor?.name}</Text>
      </Animated.View>
    </Animated.View>
  );

  const renderVendorInfo = () => (
    <View style={styles.vendorInfo}>
      <Text style={styles.vendorName}>{vendor?.name}</Text>
      <Text style={styles.vendorDescription}>{vendor?.description}</Text>

      <View style={styles.vendorStats}>
        <View style={styles.statItem}>
          <Ionicons name="star" size={16} color={COLORS.warning} />
          <Text style={styles.statText}>{vendor?.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.statText}>20-30 min</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons
            name="location-outline"
            size={16}
            color={COLORS.textLight}
          />
          <Text style={styles.statText}>1.2 km</Text>
        </View>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabs}>
      {['menu', 'reviews', 'info'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            activeTab === tab && styles.activeTab,
          ]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText,
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCategories = () => {
    const categories = ['all', ...new Set(vendor?.menu.map((item) => item.category))];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.activeCategoryChip,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText,
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <Card
      title={item.name}
      subtitle={item.description}
      image={{ uri: item.image }}
      price={item.price}
      onPress={() => {
        // TODO: Show item customization modal
      }}
    />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return (
          <View style={styles.menuContainer}>
            {renderCategories()}
            <FlatList
              data={
                selectedCategory === 'all'
                  ? vendor?.menu
                  : vendor?.menu.filter((item) => item.category === selectedCategory)
              }
              keyExtractor={(item) => item.id}
              renderItem={renderMenuItem}
              contentContainerStyle={styles.menuList}
            />
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.reviewsContainer}>
            {/* TODO: Implement reviews section */}
            <Text style={styles.comingSoon}>Reviews coming soon</Text>
          </View>
        );

      case 'info':
        return (
          <View style={styles.infoContainer}>
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Operating Hours</Text>
              {vendor?.operatingHours.map((hours, index) => (
                <Text key={index} style={styles.infoText}>
                  {hours.day}: {hours.open} - {hours.close}
                </Text>
              ))}
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Address</Text>
              <Text style={styles.infoText}>{vendor?.address.street}</Text>
              <Text style={styles.infoText}>
                {vendor?.address.city}, {vendor?.address.state}
              </Text>
            </View>
          </View>
        );
    }
  };

  if (!vendor) {
    return <Loading visible message="Loading vendor details..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        transparent
        leftIcon="arrow-back"
        rightIcon="heart-outline"
        onLeftPress={() => navigation.goBack()}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {renderHeader()}
        {renderVendorInfo()}
        {renderTabs()}
        {renderContent()}
      </Animated.ScrollView>

      {cart.items.length > 0 && (
        <View style={styles.cartPreview}>
          <View>
            <Text style={styles.cartItemCount}>
              {cart.items.reduce((acc, item) => acc + item.quantity, 0)} items
            </Text>
            <Text style={styles.cartTotal}>₹{cart.totalAmount.toFixed(2)}</Text>
          </View>
          <Button
            title="View Cart"
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.textDark,
  },
  vendorInfo: {
    marginTop: HEADER_MAX_HEIGHT,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    ...SHADOWS.light,
  },
  vendorName: {
    ...FONTS.h2,
    color: COLORS.textDark,
    marginBottom: SIZES.base,
  },
  vendorDescription: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginBottom: SIZES.padding,
  },
  vendorStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    ...FONTS.body3,
    color: COLORS.textDark,
    marginLeft: SIZES.base,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.border,
    marginHorizontal: SIZES.padding,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginTop: SIZES.padding,
    ...SHADOWS.light,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: SIZES.padding,
  },
  categories: {
    padding: SIZES.padding,
    gap: SIZES.base,
  },
  categoryChip: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.background,
  },
  activeCategoryChip: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  activeCategoryText: {
    color: COLORS.white,
  },
  menuList: {
    padding: SIZES.padding,
  },
  reviewsContainer: {
    flex: 1,
    padding: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoon: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  infoContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  infoSection: {
    marginBottom: SIZES.padding * 2,
  },
  infoTitle: {
    ...FONTS.h4,
    color: COLORS.textDark,
    marginBottom: SIZES.padding,
  },
  infoText: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  cartPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    ...SHADOWS.top,
  },
  cartItemCount: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  cartTotal: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
});

export default VendorDetailsScreen;