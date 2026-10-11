const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');

class CartService {
  async getOrCreateCartDoc(userId, sessionId) {
    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate('items.product');
      if (!cart && sessionId) {
        // Check if there was a guest cart to migrate
        cart = await Cart.findOne({ sessionId }).populate('items.product');
        if (cart) {
          cart.user = userId;
          cart.sessionId = undefined;
          await cart.save();
        }
      }
      if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
      }
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId }).populate('items.product');
      if (!cart) {
        cart = await Cart.create({ sessionId, items: [] });
      }
    } else {
      const error = new Error('User id or session id is required to access cart.');
      error.statusCode = 400;
      throw error;
    }

    return cart;
  }

  async getOrCreateCart(userId, sessionId) {
    const cart = await this.getOrCreateCartDoc(userId, sessionId);
    return await this.calculateCartTotals(cart);
  }

  async addItem(userId, sessionId, { productId, variantSku, quantity = 1, userTier = 'retail' }) {
    const cart = await this.getOrCreateCartDoc(userId, sessionId);

    const product = await Product.findById(productId);
    if (!product || product.status !== 'Published') {
      const error = new Error('Rice product not available.');
      error.statusCode = 404;
      throw error;
    }

    const variant = product.variants.find(v => v.variantSku === variantSku);
    if (!variant) {
      const error = new Error('Product variant not found.');
      error.statusCode = 404;
      throw error;
    }

    // Determine unit price based on user tier
    let unitPrice = variant.retailPrice;
    if (variant.discountPrice > 0 && variant.discountPrice < variant.retailPrice) {
      unitPrice = variant.discountPrice;
    }
    if (userTier === 'wholesale') {
      unitPrice = variant.wholesalePrice;
    } else if (userTier === 'distributor') {
      unitPrice = variant.distributorPrice;
    }

    // Check if variant already in cart
    const existingIndex = cart.items.findIndex(i => 
      (i.product._id ? i.product._id.toString() : i.product.toString()) === productId && 
      i.variantSku === variantSku
    );

    const currentQtyInCart = existingIndex > -1 ? cart.items[existingIndex].quantity : 0;
    const newQty = currentQtyInCart + Number(quantity);

    // Validate stock
    if (newQty > variant.stock) {
      const error = new Error(`Only ${variant.stock} units available in stock for ${variant.title}.`);
      error.statusCode = 400;
      throw error;
    }

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].unitPrice = unitPrice;
    } else {
      cart.items.push({
        product: product._id,
        variantSku: variant.variantSku,
        variantTitle: `${product.name} - ${variant.title}`,
        unit: variant.unit || 'kg',
        quantityOrWeight: variant.quantityOrWeight || 1,
        weightKg: variant.weightKg || variant.quantityOrWeight || 1,
        quantity: Number(quantity),
        unitPrice,
        image: variant.image || product.featuredImage
      });
    }

    await cart.save();
    return await this.getOrCreateCart(userId, sessionId);
  }

  async updateItemQty(userId, sessionId, { itemId, quantity }) {
    const cart = await this.getOrCreateCartDoc(userId, sessionId);
    const item = cart.items.id(itemId);
    if (!item) throw new Error('Cart item not found');

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      // Validate stock
      const product = await Product.findById(item.product);
      if (product) {
        const variant = product.variants.find(v => v.variantSku === item.variantSku);
        if (variant && quantity > variant.stock) {
          const error = new Error(`Only ${variant.stock} units available in stock.`);
          error.statusCode = 400;
          throw error;
        }
      }
      item.quantity = quantity;
    }

    await cart.save();
    return await this.getOrCreateCart(userId, sessionId);
  }

  async removeItem(userId, sessionId, itemId) {
    const cart = await this.getOrCreateCartDoc(userId, sessionId);
    cart.items.pull(itemId);
    await cart.save();
    return await this.getOrCreateCart(userId, sessionId);
  }

  async clearCart(userId, sessionId) {
    const cart = await this.getOrCreateCartDoc(userId, sessionId);
    cart.items = [];
    cart.appliedCoupon = undefined;
    await cart.save();
    return { items: [], subtotal: 0, grandTotal: 0 };
  }

  async applyCoupon(userId, sessionId, code) {
    const cart = await this.getOrCreateCartDoc(userId, sessionId);
    if (!cart.items.length) {
      const error = new Error('Your cart is empty.');
      error.statusCode = 400;
      throw error;
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      const error = new Error('Invalid or expired coupon code.');
      error.statusCode = 404;
      throw error;
    }

    if (new Date() > new Date(coupon.validUntil)) {
      const error = new Error('This coupon has expired.');
      error.statusCode = 400;
      throw error;
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      const error = new Error('Coupon usage limit reached.');
      error.statusCode = 400;
      throw error;
    }

    let subtotal = cart.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    if (subtotal < coupon.minOrderAmount) {
      const error = new Error(`Minimum order of ৳${coupon.minOrderAmount} required for this coupon.`);
      error.statusCode = 400;
      throw error;
    }

    let discount = 0;
    if (coupon.discountType === 'Percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount > 0 && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    cart.appliedCoupon = {
      code: coupon.code,
      discountAmount: Math.round(discount),
      discountType: coupon.discountType
    };

    await cart.save();
    return await this.calculateCartTotals(cart);
  }

  async removeCoupon(userId, sessionId) {
    const cart = await this.getOrCreateCartDoc(userId, sessionId);
    cart.appliedCoupon = undefined;
    await cart.save();
    return await this.getOrCreateCart(userId, sessionId);
  }

  async calculateCartTotals(cart) {
    let subtotal = 0;
    let totalWeightKg = 0;

    cart.items.forEach(item => {
      subtotal += item.quantity * item.unitPrice;
      totalWeightKg += item.quantity * (item.weightKg || 1);
    });

    const settings = await Settings.findOne() || { freeDeliveryThresholdRetail: 2500, defaultRetailDeliveryFee: 80 };
    const deliveryCharge = (subtotal >= settings.freeDeliveryThresholdRetail || subtotal === 0) ? 0 : settings.defaultRetailDeliveryFee;
    const discountAmount = cart.appliedCoupon ? cart.appliedCoupon.discountAmount : 0;
    const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

    return {
      _id: cart._id,
      items: cart.items,
      appliedCoupon: cart.appliedCoupon,
      subtotal,
      totalWeightKg,
      deliveryCharge,
      discountAmount,
      grandTotal,
      freeDeliveryThreshold: settings.freeDeliveryThresholdRetail
    };
  }
}

module.exports = new CartService();
