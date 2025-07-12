import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Components
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import TextInput from '../components/common/TextInput';

// Theme
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

// Types
import { RootState } from '../store';
import { updateCartItem, removeFromCart, clearCart } from '../store/slices/orderSlice';

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState('');
  const [note, setNote] = useState('');

  const cart = useSelector((state: RootState) => state.order.cart);
  const vendor = useSelector((state: RootState) =>
    state.vendor.vendors.find((v) => v.id === cart.vendorId)
  );

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => dispatch(removeFromCart(itemId)),
          },
        ]
      );
    } else {
      dispatch(updateCartItem({ itemId, quantity }));
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    navigation.navigate('Checkout', {
      note,
      couponCode,
    });
  };

  const renderCartItem = (item: any) => (
    <View key={item.id} style={styles.cartItem}>
      <Image source={{ uri: item.item.image }} style={styles.itemImage} />

      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.item.price.toFixed(2)}</Text>

        {item.customization && (
          <Text style={styles.customization}>
            {Object.entries(item.customization)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')}
          </Text>
        )}
      </View>

      <View style={styles.quantityControl}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        <Text style={styles.quantity}>{item.quantity}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPriceBreakdown = () => {
    const subtotal = cart.totalAmount;
    const deliveryFee = 40;
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + deliveryFee + tax;

    return (
      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Subtotal</Text>
          <Text style={styles.priceValue}>₹{subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Delivery Fee</Text>
          <Text style={styles.priceValue}>₹{deliveryFee.toFixed(2)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Tax (5%)</Text>
          <Text style={styles.priceValue}>₹{tax.toFixed(2)}</Text>
        </View>

        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  if (cart.items.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Cart" />
        <View style={styles.emptyCart}>
          <Ionicons
            name="cart-outline"
            size={64}
            color={COLORS.textLight}
          />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Button
            title="Start Shopping"
            onPress={() => navigation.navigate('Explore')}
            style={styles.shopButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={vendor?.name || 'Cart'}
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cartItems}>
          {cart.items.map(renderCartItem)}
        </View>

        <View style={styles.couponContainer}>
          <TextInput
            placeholder="Enter coupon code"
            value={couponCode}
            onChangeText={setCouponCode}
            rightIcon="pricetag"
          />
        </View>

        <View style={styles.noteContainer}>
          <TextInput
            placeholder="Add a note for the vendor"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            rightIcon="create"
          />
        </View>

        {renderPriceBreakdown()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
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
  cartItems: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    ...SHADOWS.light,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    paddingBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
  },
  itemInfo: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  itemName: {
    ...FONTS.body2,
    color: COLORS.textDark,
  },
  itemPrice: {
    ...FONTS.body3,
    color: COLORS.primary,
    marginTop: SIZES.base,
  },
  customization: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: SIZES.base,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SIZES.padding,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    ...FONTS.h4,
    color: COLORS.textDark,
    marginHorizontal: SIZES.padding,
  },
  couponContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginTop: SIZES.padding,
    ...SHADOWS.light,
  },
  noteContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginTop: SIZES.padding,
    ...SHADOWS.light,
  },
  priceBreakdown: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginTop: SIZES.padding,
    ...SHADOWS.light,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  priceLabel: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  priceValue: {
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
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  shopButton: {
    width: '50%',
  },
});

export default CartScreen;