import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Components
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';

// Theme
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

// Types
import { RootState } from '../store';
import { Order, OrderStatus } from '../types';

const OrdersScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  const currentOrder = useSelector((state: RootState) => state.order.currentOrder);
  const orderHistory = useSelector((state: RootState) => state.order.orderHistory);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return COLORS.warning;
      case 'confirmed':
        return COLORS.info;
      case 'preparing':
        return COLORS.primary;
      case 'ready':
        return COLORS.success;
      case 'delivering':
        return COLORS.info;
      case 'delivered':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.textLight;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'confirmed':
        return 'checkmark-circle-outline';
      case 'preparing':
        return 'restaurant-outline';
      case 'ready':
        return 'thumbs-up-outline';
      case 'delivering':
        return 'bicycle-outline';
      case 'delivered':
        return 'checkmark-done-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const renderTabs = () => (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'current' && styles.activeTab,
        ]}
        onPress={() => setActiveTab('current')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'current' && styles.activeTabText,
          ]}
        >
          Current Orders
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'history' && styles.activeTab,
        ]}
        onPress={() => setActiveTab('history')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'history' && styles.activeTabText,
          ]}
        >
          Order History
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderCard = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View style={styles.vendorInfo}>
          <Image
            source={{ uri: item.vendor.photos[0] }}
            style={styles.vendorImage}
          />
          <View>
            <Text style={styles.vendorName}>{item.vendor.name}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons
            name={getStatusIcon(item.status)}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status) },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {item.items.map((orderItem, index) => (
          <Text key={index} style={styles.itemText}>
            {orderItem.quantity}x {orderItem.item.name}
          </Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalAmount}>₹{item.totalAmount.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (activeTab === 'current') {
      if (!currentOrder) {
        return (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="restaurant-outline"
              size={64}
              color={COLORS.textLight}
            />
            <Text style={styles.emptyText}>No active orders</Text>
          </View>
        );
      }
      return renderOrderCard({ item: currentOrder });
    }

    return (
      <FlatList
        data={orderHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="receipt-outline"
              size={64}
              color={COLORS.textLight}
            />
            <Text style={styles.emptyText}>No order history</Text>
          </View>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Orders" />
      {renderTabs()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    ...SHADOWS.light,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.base,
  },
  activeTab: {
    backgroundColor: COLORS.primary + '20',
  },
  tabText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  listContent: {
    padding: SIZES.padding,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    ...SHADOWS.light,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.base,
  },
  vendorName: {
    ...FONTS.h4,
    color: COLORS.textDark,
  },
  orderDate: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  statusText: {
    ...FONTS.body4,
    marginLeft: SIZES.base,
  },
  orderItems: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  itemText: {
    ...FONTS.body3,
    color: COLORS.textDark,
    marginBottom: SIZES.base,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  totalAmount: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginTop: SIZES.padding,
  },
});

export default OrdersScreen;