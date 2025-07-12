import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

// Components
import TextInput from '../components/common/TextInput';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

// Redux
import { RootState } from '../store';
import { updateFilters } from '../store/slices/vendorSlice';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const vendors = useSelector((state: RootState) => state.vendor.vendors);
  const filters = useSelector((state: RootState) => state.vendor.filters);

  useEffect(() => {
    fetchVendors();
  }, [filters]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      // TODO: Implement vendor fetching with filters
      // const filteredVendors = await getVendorsWithFilters(filters);
      // dispatch(setVendors(filteredVendors));
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TextInput
        placeholder="Search vendors, dishes, cuisine..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon="search-outline"
        containerStyle={styles.searchContainer}
      />
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(true)}
      >
        <Ionicons name="options-outline" size={24} color={COLORS.textDark} />
      </TouchableOpacity>
    </View>
  );

  const renderViewToggle = () => (
    <View style={styles.viewToggle}>
      <TouchableOpacity
        style={[styles.toggleButton, !showMap && styles.activeToggle]}
        onPress={() => setShowMap(false)}
      >
        <Ionicons
          name="grid-outline"
          size={20}
          color={!showMap ? COLORS.primary : COLORS.textLight}
        />
        <Text
          style={[
            styles.toggleText,
            !showMap && styles.activeToggleText,
          ]}
        >
          List
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.toggleButton, showMap && styles.activeToggle]}
        onPress={() => setShowMap(true)}
      >
        <Ionicons
          name="map-outline"
          size={20}
          color={showMap ? COLORS.primary : COLORS.textLight}
        />
        <Text
          style={[
            styles.toggleText,
            showMap && styles.activeToggleText,
          ]}
        >
          Map
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFiltersModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Cuisine Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Cuisine</Text>
              <View style={styles.chipContainer}>
                {['Local', 'Street Food', 'Chinese', 'Indian', 'Thai'].map(
                  (cuisine) => (
                    <TouchableOpacity
                      key={cuisine}
                      style={[
                        styles.chip,
                        filters.cuisine.includes(cuisine) && styles.activeChip,
                      ]}
                      onPress={() => {
                        const newCuisine = filters.cuisine.includes(cuisine)
                          ? filters.cuisine.filter((c) => c !== cuisine)
                          : [...filters.cuisine, cuisine];
                        dispatch(updateFilters({ cuisine: newCuisine }));
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          filters.cuisine.includes(cuisine) &&
                            styles.activeChipText,
                        ]}
                      >
                        {cuisine}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {/* Rating Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Minimum Rating</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      filters.rating >= rating && styles.activeRating,
                    ]}
                    onPress={() =>
                      dispatch(updateFilters({ rating }))
                    }
                  >
                    <Ionicons
                      name={filters.rating >= rating ? 'star' : 'star-outline'}
                      size={24}
                      color={
                        filters.rating >= rating
                          ? COLORS.warning
                          : COLORS.textLight
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Distance Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Distance (km)</Text>
              <View style={styles.chipContainer}>
                {[1, 3, 5, 10].map((distance) => (
                  <TouchableOpacity
                    key={distance}
                    style={[
                      styles.chip,
                      filters.distance === distance && styles.activeChip,
                    ]}
                    onPress={() =>
                      dispatch(updateFilters({ distance }))
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.distance === distance && styles.activeChipText,
                      ]}
                    >
                      {distance} km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              title="Show Results"
              onPress={() => setShowFilters(false)}
              style={styles.applyButton}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return <Loading visible message="Finding vendors..." />;
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderViewToggle()}

      {showMap ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {vendors.map((vendor) => (
            <Marker
              key={vendor.id}
              coordinate={{
                latitude: vendor.location.latitude,
                longitude: vendor.location.longitude,
              }}
              title={vendor.name}
              description={vendor.description}
              onPress={() =>
                navigation.navigate('VendorDetails', { vendorId: vendor.id })
              }
            />
          ))}
        </MapView>
      ) : (
        <FlatList
          data={vendors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card
              title={item.name}
              subtitle={item.description}
              image={{ uri: item.photos[0] }}
              rating={item.rating}
              tags={item.cuisine}
              distance="1.2 km"
              onPress={() =>
                navigation.navigate('VendorDetails', { vendorId: item.id })
              }
            />
          )}
        />
      )}

      {renderFiltersModal()}
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
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  searchContainer: {
    flex: 1,
    marginBottom: 0,
  },
  filterButton: {
    marginLeft: SIZES.padding,
    padding: SIZES.base,
  },
  viewToggle: {
    flexDirection: 'row',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginRight: SIZES.padding,
  },
  activeToggle: {
    backgroundColor: COLORS.primary + '20',
  },
  toggleText: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginLeft: SIZES.base,
  },
  activeToggleText: {
    color: COLORS.primary,
  },
  map: {
    flex: 1,
  },
  listContent: {
    padding: SIZES.padding,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    paddingTop: SIZES.padding,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.textDark,
  },
  filterSection: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTitle: {
    ...FONTS.h4,
    color: COLORS.textDark,
    marginBottom: SIZES.padding,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
  },
  chip: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    ...FONTS.body3,
    color: COLORS.textDark,
  },
  activeChipText: {
    color: COLORS.white,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: SIZES.padding,
  },
  ratingButton: {
    padding: SIZES.base,
  },
  activeRating: {
    transform: [{ scale: 1.2 }],
  },
  applyButton: {
    margin: SIZES.padding,
  },
});

export default ExploreScreen;