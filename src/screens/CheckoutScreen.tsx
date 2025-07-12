import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Components
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

// Theme
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

// Types
import { RootState } from '../store';
import { Address } from '../types';

const PAYMENT_METHODS = [
  {
    id: 'upi',
    name: 'UPI',
    icon: 'phone-portrait-outline',
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: 'card-outline',
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    icon: 'wallet-outline',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: 'cash-outline',
  },
];

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [loading, setLoading] = useState(false);

  const cart = useSelector((state: RootState) => state.order.cart);
  const addresses = useSelector((state: RootState) => state.user.savedAddresses);
  const vendor = useSelector((state: RootState) =>
    state.vendor.vendors.find((v) => v.id === cart.vendorId)
  );

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement order placement
      // const order = await createOrder({
      //   items: cart.items,
      //   vendorId: cart.vendorId,
      //   address: selectedAddress,
      //   paymentMethod: selectedPayment,
      //   note: route.params?.note,
      //   couponCode: route.params?.couponCode,
      // });
      // dispatch(setCurrentOrder(order));
      // dispatch(clearCart());
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigation.replace('OrderTracking', { orderId: 'new-order-id' });
    } catch (error) {
      Alert.alert('Error', 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const renderAddressSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Addresses')}
        >
          <Text style={styles.addButton}>Add New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.addressList}
      >
        {addresses.map((address) => (
          <TouchableOpacity
            key={address.id}
            style={[
              styles.addressCard,
              selectedAddress?.id === address.id && styles.selectedAddress,
            ]}
            onPress={() => setSelectedAddress(address)}
          >
            <Ionicons
              name="location"
              size={24}
              color={COLORS.primary}
              style={styles.addressIcon}
            />
            <View>
              <Text style={styles.addressType}>{address.type}</Text>
              <Text style={styles.addressText}>{address.street}</Text>
              <Text style={styles.addressText}>
                {address.city}, {address.state}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPaymentSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Method</Text>

      {PAYMENT_METHODS.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentOption,
            selectedPayment === method.id && styles.selectedPayment,
          ]}
          onPress={() => setSelectedPayment(method.id)}
        >
          <View style={styles.paymentInfo}>
            <Ionicons
              name={method.icon}
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.paymentName}>{method.name}</Text>
          </View>

          <View
            style={[
              styles.radioButton,
              selectedPayment === method.id && styles.radioButtonSelected,
            ]}
          >
            {selectedPayment === method.id && (
              <View style={styles.radioButtonInner} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOrderSummary = () => {
    const subtotal = cart.totalAmount;
    const deliveryFee = 40;
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + deliveryFee + tax;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items Total</Text>
          <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (5%)</Text>
          <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return <Loading visible message="Placing your order..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Checkout"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderAddressSection()}
        {renderPaymentSection()}
        {renderOrderSummary()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
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
  section: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginTop: SIZES.padding,
    ...SHADOWS.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.textDark,
  },
  addButton: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  addressList: {
    paddingVertical: SIZES.padding,
    gap: SIZES.padding,
  },
  addressCard: {
    width: 200,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedAddress: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  addressIcon: {
    marginBottom: SIZES.base,
  },
  addressType: {
    ...FONTS.h4,
    color: COLORS.textDark,
    marginBottom: SIZES.base,
  },
  addressText: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedPayment: {
    backgroundColor: COLORS.primary + '10',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentName: {
    ...FONTS.body2,
    color: COLORS.textDark,
    marginLeft: SIZES.padding,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  summaryLabel: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  summaryValue: {
    ...FONTS.body3,
    color: COLORS.textDark,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.padding,
    marginTop: SIZES.padding,
  },
  totalLabel: {
    ...FONTS.h4,
    color: COLORS.textDark,
  },
  totalValue: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    ...SHADOWS.top,
  },
});

export default CheckoutScreen;