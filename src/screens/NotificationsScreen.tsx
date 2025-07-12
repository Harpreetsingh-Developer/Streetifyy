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
import { Ionicons } from '@expo/vector-icons';

// Components
import Header from '../components/common/Header';

// Theme
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

type NotificationType = 'order' | 'promo' | 'social' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
  image?: string;
}

// Mock data - Replace with actual data from API
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order #1234 has been delivered successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    data: { orderId: '1234' },
  },
  {
    id: '2',
    type: 'promo',
    title: 'Special Offer',
    message: 'Get 50% off on your first order from new vendors',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: true,
    image: 'https://example.com/promo.jpg',
  },
  {
    id: '3',
    type: 'social',
    title: 'New Follower',
    message: 'John Doe started following you',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    data: { userId: 'user123' },
    image: 'https://ui-avatars.com/api/?name=John+Doe',
  },
  {
    id: '4',
    type: 'system',
    title: 'App Update Available',
    message: 'A new version of Streetify is available. Update now for new features!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
];

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'order':
        return 'receipt-outline';
      case 'promo':
        return 'pricetag-outline';
      case 'social':
        return 'people-outline';
      case 'system':
        return 'information-circle-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'order':
        return COLORS.primary;
      case 'promo':
        return COLORS.warning;
      case 'social':
        return COLORS.info;
      case 'system':
        return COLORS.error;
      default:
        return COLORS.textLight;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    ));

    // Navigate based on notification type
    switch (notification.type) {
      case 'order':
        navigation.navigate('OrderTracking', { orderId: notification.data.orderId });
        break;
      case 'promo':
        navigation.navigate('Explore');
        break;
      case 'social':
        navigation.navigate('Profile', { userId: notification.data.userId });
        break;
      case 'system':
        // Handle system notifications
        break;
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadItem]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) + '20' }]}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.notificationImage} />
        ) : (
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={24}
            color={getNotificationColor(item.type)}
          />
        )}
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>

        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>

      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color={COLORS.textLight}
            />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
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
  listContent: {
    padding: SIZES.padding,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    ...SHADOWS.light,
  },
  unreadItem: {
    backgroundColor: COLORS.white,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  notificationImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  notificationTitle: {
    ...FONTS.h4,
    color: COLORS.textDark,
  },
  timestamp: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  notificationMessage: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SIZES.padding,
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

export default NotificationsScreen;