const Wishlist = require('../models/Wishlist');

class WishlistService {
  async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: 'products',
      populate: [
        { path: 'category', select: 'name slug' },
        { path: 'riceVariety', select: 'name' }
      ]
    });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    return wishlist.products;
  }

  async toggleWishlist(userId, productId) {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [productId] });
      return { inWishlist: true, productsCount: 1 };
    }

    const exists = wishlist.products.some(p => p.toString() === productId);
    if (exists) {
      wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
      await wishlist.save();
      return { inWishlist: false, productsCount: wishlist.products.length };
    } else {
      wishlist.products.push(productId);
      await wishlist.save();
      return { inWishlist: true, productsCount: wishlist.products.length };
    }
  }
}

module.exports = new WishlistService();
