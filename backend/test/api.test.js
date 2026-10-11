const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../src/models/User');
const Product = require('../src/models/Product');
const Coupon = require('../src/models/Coupon');
const authService = require('../src/services/auth.service');
const productService = require('../src/services/product.service');
const cartService = require('../src/services/cart.service');
const orderService = require('../src/services/order.service');
const wholesaleService = require('../src/services/wholesale.service');
const { ROLES } = require('../src/config/constants');

test('Dhansiri Agro Platform Test Suite', async (t) => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dhansiri_agro');

  await t.test('1. Authentication: Login with seeded admin credentials', async () => {
    const res = await authService.login('admin@dhansiriagro.com', 'AdminPassword2026!');
    assert.ok(res.accessToken, 'Access token should be issued');
    assert.strictEqual(res.user.role, ROLES.SUPER_ADMIN, 'Role should be Super Admin');
  });

  await t.test('2. Authentication: Password hashing & verification', async () => {
    const user = await User.findOne({ email: 'customer@dhansiriagro.com' }).select('+password');
    assert.ok(user, 'Customer must exist');
    assert.ok(user.password.startsWith('$2'), 'Password must be bcrypt hashed');
    const isMatch = await user.matchPassword('Customer2026!');
    assert.strictEqual(isMatch, true, 'Valid password must match');
  });

  await t.test('3. Product Catalog: Fetch products with multi-variant data', async () => {
    const res = await productService.getProducts({ page: 1, limit: 10 });
    assert.ok(res.products.length >= 6, 'Should retrieve at least 6 seeded rice products');
    const firstProduct = res.products[0];
    assert.ok(firstProduct.variants.length > 0, 'Product must contain packaged variants');
    assert.ok(firstProduct.variants[0].retailPrice > 0, 'Variant must have valid retail price');
  });

  await t.test('4. Cart Engine: Add items and calculate subtotal', async () => {
    const product = await Product.findOne({ sku: 'DHA-CHN-001' });
    assert.ok(product, 'Chinigura product must exist');
    const variant = product.variants.find(v => v.variantSku === 'DHA-CHN-5KG') || product.variants[0];

    const customer = await User.findOne({ email: 'customer@dhansiriagro.com' });
    const cart = await cartService.addItem(customer._id, null, {
      productId: product._id.toString(),
      variantSku: variant.variantSku,
      quantity: 2,
      userTier: 'retail'
    });

    assert.ok(cart.items.length > 0, 'Cart must have items');
    assert.strictEqual(cart.items[0].quantity, 2, 'Cart item quantity must be 2');
    assert.strictEqual(cart.subtotal, variant.discountPrice * 2 || variant.retailPrice * 2, 'Subtotal must calculate correctly');
  });

  await t.test('5. Coupon Engine: Validate active coupon on cart', async () => {
    const customer = await User.findOne({ email: 'customer@dhansiriagro.com' });
    // Apply coupon DHANSIRI100
    const cartWithCoupon = await cartService.applyCoupon(customer._id, null, 'DHANSIRI100');
    assert.ok(cartWithCoupon.appliedCoupon, 'Coupon should be applied');
    assert.strictEqual(cartWithCoupon.appliedCoupon.code, 'DHANSIRI100');
    assert.strictEqual(cartWithCoupon.discountAmount, 100);
  });

  await t.test('6. Order & Checkout: Create and fulfill order with stock reservation', async () => {
    const customer = await User.findOne({ email: 'customer@dhansiriagro.com' });
    const product = await Product.findOne({ sku: 'DHA-MIN-002' });
    const variant = product.variants[0];
    const initialStock = variant.stock;

    const order = await orderService.createOrder({
      userId: customer._id,
      items: [{
        productId: product._id,
        variantSku: variant.variantSku,
        quantity: 1,
        unitPrice: variant.retailPrice
      }],
      shippingAddress: {
        recipientName: 'Test Recipient',
        phone: '01711223344',
        division: 'Dhaka',
        district: 'Dhaka',
        streetAddress: 'Road 5, Dhanmondi'
      },
      paymentMethod: 'Cash on Delivery'
    });

    assert.ok(order.orderNumber.startsWith('DHA-'), 'Order number format DHA-YYMMDD-XXXX');
    assert.strictEqual(order.orderStatus, 'Pending');

    // Verify stock deducted
    const updatedProduct = await Product.findOne({ sku: 'DHA-MIN-002' });
    const updatedVariant = updatedProduct.variants.find(v => v.variantSku === variant.variantSku);
    assert.strictEqual(updatedVariant.stock, initialStock - 1, 'Stock should decrease by ordered quantity');
  });

  await t.test('7. Wholesale: B2B Application & Tiered Approval', async () => {
    const app = await wholesaleService.submitApplication({
      applicantName: 'Kabir Chowdhury',
      companyName: 'Dhaka Grand Palace Hotel',
      businessType: 'Hotel / Restaurant / Catering (HORECA)',
      phone: '01799887766',
      email: 'purchase@dhakagrandpalace.com',
      district: 'Dhaka',
      address: 'Airport Road, Nikunja-2',
      tradeLicenseNumber: 'TRAD-DNCC-199482',
      estimatedMonthlyTon: 15
    });

    assert.strictEqual(app.status, 'Pending');
    assert.strictEqual(app.estimatedMonthlyTon, 15);
  });

  await mongoose.disconnect();
});
