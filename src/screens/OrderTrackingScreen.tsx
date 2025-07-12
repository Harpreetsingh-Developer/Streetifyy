import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Components
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

// Theme
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

// Types
import { RootState } from '../store';
import { OrderStatus } from '../types';

const DELIVERY_STAGES = [
  {
    status: 'pending' as OrderStatus,
    title: 'Order Placed',
    description: 'Your order has been received',
    icon: 'receipt-outline',
  },
  {
    status: 'confirmed' as OrderStatus,
    title: 'Order Confirmed',
    description: 'Vendor has accepted your order',
    icon: 'checkmark-circle-outline',
  },
  {
    status: 'preparing' as OrderStatus,
    title: 'Preparing',
    description: 'Your food is being prepared',
    icon: 'restaurant-outline',
  },
  {
    status: 'ready' as OrderStatus,
    title: 'Ready for Pickup',
    description: 'Order is ready for delivery',
    icon: 'thumbs-up-outline',
  },
  {
    status: 'delivering' as OrderStatus,
    title: 'On the Way',
    description: 'Order is out for delivery',
    icon: 'bicycle-outline',
  },
  {
    status: 'delivered' as OrderStatus,
    title: 'Delivered',
    description: 'Order has been delivered',
    icon: 'checkmark-done-circle-outline',
  },
];

const OrderTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);

  const currentOrder = useSelector((state: RootState) => state.order.currentOrder);
  const vendor = useSelector((state: RootState) =>
    state.vendor.vendors.find((v) => v.id === currentOrder?.vendorId)
  );

  useEffect(() => {
    if (!currentOrder) {
      // TODO: Fetch order details
      // dispatch(fetchOrderDetails(route.params?.orderId));
    }
  }, [currentOrder, route.params?.orderId]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleSupport = () => {
    navigation.navigate('Support', { orderId: currentOrder?.id });
  };

  const renderDeliveryStatus = () => (
    <View style={styles.statusContainer}>
      {DELIVERY_STAGES.map((stage, index) => {
        const isCompleted =
          DELIVERY_STAGES.findIndex((s) => s.status === currentOrder?.status) >=
          index;
        const isActive = stage.status === currentOrder?.status;

        return (
          <View key={stage.status} style={styles.statusItem}>
            <View style={styles.statusLine}>
              <View
                style={[
                  styles.statusDot,
                  isCompleted && styles.completedDot,
                  isActive && styles.activeDot,
                ]}
              >
                <Ionicons
                  name={stage.icon}
                  size={16}
                  color={isCompleted ? COLORS.white : COLORS.textLight}
                />
              </View>
              {index < DELIVERY_STAGES.length - 1 && (
                <View
                  style={[
                    styles.statusConnector,
                    isCompleted && styles.completedConnector,
                  ]}
                />
              )}
            </View>

            <View style={styles.statusContent}>
              <Text
                style={[
                  styles.statusTitle,
                  isActive && styles.activeStatusTitle,
                ]}
              >
                {stage.title}
              </Text>
              <Text style={styles.statusDescription}>{stage.description}</Text>
              {isActive && (
                <Text style={styles.statusTime}>
                  {new Date().toLocaleTimeString()}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderDeliveryMap = () => {
    if (!currentOrder?.status || currentOrder.status === 'cancelled') {
      return null;
    }

    return (
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {vendor && (
            <Marker
              coordinate={{
                latitude: vendor.location.latitude,
                longitude: vendor.location.longitude,
              }}
              title={vendor.name}
              description="Vendor Location"
            >
              <Ionicons
                name="restaurant"
                size={24}
                color={COLORS.primary}
              />
            </Marker>
          )}

          {currentOrder.deliveryPartner && (
            <Marker
              coordinate={{
                latitude: currentOrder.deliveryPartner.location.latitude,
                longitude: currentOrder.deliveryPartner.location.longitude,
              }}
              title={currentOrder.deliveryPartner.name}
              description="Delivery Partner"
            >
              <Ionicons
                name="bicycle"
                size={24}
                color={COLORS.primary}
              />
            </Marker>
          )}
        </MapView>
      </View>
    );
  };

  const renderDeliveryPartner = () => {
    if (
      !currentOrder?.deliveryPartner ||
      currentOrder.status !== 'delivering'
    ) {
      return null;
    }

    return (
      <View style={styles.partnerCard}>
        <View style={styles.partnerInfo}>
          <Image
            source={{ uri: currentOrder.deliveryPartner.photo }}
            style={styles.partnerImage}
          />
          <View>
            <Text style={styles.partnerName}>
              {currentOrder.deliveryPartner.name}
            </Text>
            <Text style={styles.partnerRating}>
              <Ionicons name="star" size={16} color={COLORS.warning} />
              {currentOrder.deliveryPartner.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={styles.partnerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCall(currentOrder.deliveryPartner.phone)}
          >
            <Ionicons name="call" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSupport}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading || !currentOrder) {
    return <Loading visible message="Loading order details..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title={`Order #${currentOrder.id.slice(-6)}`}
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderDeliveryMap()}
        {renderDeliveryPartner()}
        {renderDeliveryStatus()}

        <View style={styles.support}>
          <Button
            title="Need Help?"
            onPress={handleSupport}
            variant="outline"
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
  mapContainer: {
    height: 200,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  map: {
    flex: 1,
  },
  partnerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginTop: SIZES.padding,
    ...SHADOWS.light,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.padding,
  },
  partnerName: {
    ...FONTS.h4,
    color: COLORS.textDark,
  },
  partnerRating: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: SIZES.base,
  },
  partnerActions: {
    flexDirection: 'row',
    gap: SIZES.padding,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginTop: SIZES.padding,
    ...SHADOWS.light,
  },
  statusItem: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
  },
  statusLine: {
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  statusDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  completedDot: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  activeDot: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  statusConnector: {
    width: 2,
    height: 40,
    backgroundColor: COLORS.border,
  },
  completedConnector: {
    backgroundColor: COLORS.primary,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    ...FONTS.h4,
    color: COLORS.textDark,
  },
  activeStatusTitle: {
    color: COLORS.primary,
  },
  statusDescription: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: SIZES.base,
  },
  statusTime: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginTop: SIZES.base,
  },
  support: {
    padding: SIZES.padding,
  },
});

export default OrderTrackingScreen;