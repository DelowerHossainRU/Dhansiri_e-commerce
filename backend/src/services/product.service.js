const Product = require('../models/Product');
const Category = require('../models/Category');
const RiceVariety = require('../models/RiceVariety');
const Farmer = require('../models/Farmer');
const slugify = require('slugify');

class ProductService {
  async getProducts(query = {}, userTier = 'retail') {
    const {
      search,
      category,
      subcategory,
      productType,
      variety,
      district,
      unit,
      isSeasonal,
      seasonalStatus,
      minPrice,
      maxPrice,
      isFeatured,
      isBestSeller,
      isWholesaleAvailable,
      inStock,
      sort = 'newest',
      page = 1,
      limit = 12,
      status = 'Published'
    } = query;

    const filter = {};
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { banglaName: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { variety: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) filter.category = cat._id;
      }
    }

    if (subcategory) {
      filter.subcategory = new RegExp(subcategory, 'i');
    }

    if (productType) {
      filter.productType = productType;
    }

    if (variety) {
      filter.$or = [
        { variety: new RegExp(variety, 'i') },
        { 'seasonalInfo.seasonName': new RegExp(variety, 'i') }
      ];
    }

    if (district) {
      filter.$or = [
        { district: new RegExp(district, 'i') },
        { origin: new RegExp(district, 'i') }
      ];
    }

    if (unit) {
      filter['variants.unit'] = unit;
    }

    if (isSeasonal !== undefined && isSeasonal !== '') {
      filter.isSeasonal = isSeasonal === 'true' || isSeasonal === true;
    }

    if (seasonalStatus) {
      filter['seasonalInfo.availabilityStatus'] = seasonalStatus;
    }

    if (isFeatured !== undefined && isFeatured !== '') {
      filter.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    if (isBestSeller !== undefined && isBestSeller !== '') {
      filter.isBestSeller = isBestSeller === 'true' || isBestSeller === true;
    }

    if (isWholesaleAvailable !== undefined && isWholesaleAvailable !== '') {
      filter.isWholesaleAvailable = isWholesaleAvailable === 'true' || isWholesaleAvailable === true;
    }

    if (inStock === 'true' || inStock === true) {
      filter['variants.stock'] = { $gt: 0 };
    }

    // Dynamic price filtering across variants based on pricing tier
    if (minPrice || maxPrice) {
      const priceField = userTier === 'wholesale' ? 'variants.wholesalePrice' : 
                         userTier === 'distributor' ? 'variants.distributorPrice' : 'variants.retailPrice';
      filter[priceField] = {};
      if (minPrice) filter[priceField].$gte = Number(minPrice);
      if (maxPrice) filter[priceField].$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { 'variants.retailPrice': 1 };
    else if (sort === 'price_desc') sortOptions = { 'variants.retailPrice': -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'popular' || sort === 'best_seller') sortOptions = { isBestSeller: -1, reviewCount: -1 };
    else if (sort === 'recently_harvested') sortOptions = { 'traceability.harvestDate': -1, createdAt: -1 };
    else if (sort === 'featured') sortOptions = { isFeatured: -1, createdAt: -1 };
    else if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug banglaName icon')
      .populate('riceVariety', 'name banglaName grainType originRegion aromaLevel')
      .populate('traceability.farmer', 'name farmName district upazila phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    return {
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async getProductBySlug(slug) {
    const product = await Product.findOne({ slug })
      .populate('category')
      .populate('riceVariety')
      .populate('traceability.farmer');

    if (!product) {
      const error = new Error('Agricultural product not found.');
      error.statusCode = 404;
      throw error;
    }

    // Related products in same category
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category ? product.category._id : null,
      status: 'Published'
    }).limit(4).populate('category', 'name slug banglaName');

    return { product, relatedProducts };
  }

  async getProductById(id) {
    const product = await Product.findById(id)
      .populate('category')
      .populate('riceVariety')
      .populate('traceability.farmer');
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async getSeasonalProducts(limit = 8) {
    return await Product.find({
      status: 'Published',
      isSeasonal: true
    })
    .populate('category', 'name slug banglaName')
    .sort({ 'seasonalInfo.expectedHarvestDate': 1, createdAt: -1 })
    .limit(Number(limit));
  }

  async getFreshHarvest(limit = 8) {
    return await Product.find({
      status: 'Published',
      $or: [
        { 'seasonalInfo.availabilityStatus': 'Available Now' },
        { 'traceability.harvestDate': { $exists: true } }
      ]
    })
    .populate('category', 'name slug banglaName')
    .sort({ 'traceability.harvestDate': -1, createdAt: -1 })
    .limit(Number(limit));
  }

  async getBestSellers(limit = 8) {
    return await Product.find({
      status: 'Published',
      $or: [{ isBestSeller: true }, { reviewCount: { $gte: 1 } }]
    })
    .populate('category', 'name slug banglaName')
    .sort({ reviewCount: -1, rating: -1 })
    .limit(Number(limit));
  }

  async createProduct(data) {
    if (!data.slug) {
      data.slug = slugify(data.name, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);
    }
    return await Product.create(data);
  }

  async updateProduct(id, data) {
    if (data.name && !data.slug) {
      data.slug = slugify(data.name, { lower: true, strict: true });
    }
    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!product) {
      const error = new Error('Product not found to update.');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      const error = new Error('Product not found to delete.');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }
}

module.exports = new ProductService();
