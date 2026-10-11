require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const RiceVariety = require('../models/RiceVariety');
const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const QualityInspection = require('../models/QualityInspection');
const Warehouse = require('../models/Warehouse');
const Inventory = require('../models/Inventory');
const Supplier = require('../models/Supplier');
const Coupon = require('../models/Coupon');
const FAQ = require('../models/FAQ');
const Testimonial = require('../models/Testimonial');
const BlogPost = require('../models/BlogPost');
const Settings = require('../models/Settings');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Quotation = require('../models/Quotation');
const WholesaleApplication = require('../models/WholesaleApplication');
const { ROLES, PRICING_TIERS, ORDER_STATUSES, PAYMENT_STATUSES, PAYMENT_METHODS } = require('../config/constants');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dhansiri_agro';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB for seeding full agricultural platform...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      RiceVariety.deleteMany({}),
      Product.deleteMany({}),
      Farmer.deleteMany({}),
      QualityInspection.deleteMany({}),
      Warehouse.deleteMany({}),
      Inventory.deleteMany({}),
      Supplier.deleteMany({}),
      Coupon.deleteMany({}),
      FAQ.deleteMany({}),
      Testimonial.deleteMany({}),
      BlogPost.deleteMany({}),
      Settings.deleteMany({}),
      Order.deleteMany({}),
      Invoice.deleteMany({}),
      Quotation.deleteMany({}),
      WholesaleApplication.deleteMany({})
    ]);

    console.log('[Seed] Cleared existing data.');

    // 1. Warehouses across Bangladesh
    const whDinajpur = await Warehouse.create({
      name: 'Dhansiri Mill Silo & Processing Hub',
      code: 'WH-DINAJPUR-01',
      district: 'Dinajpur',
      address: 'Plot 12-16, Pulhat Industrial Estate, Dinajpur-5200',
      capacityTons: 5000,
      contactPerson: 'Md. Farhad Reza',
      phone: '+8801712000001',
      isCentral: true
    });

    const whDhaka = await Warehouse.create({
      name: 'Greater Dhaka Distribution Center',
      code: 'WH-DHAKA-02',
      district: 'Dhaka',
      address: 'Plot 45, Tejgaon Industrial Area, Dhaka-1208',
      capacityTons: 1500,
      contactPerson: 'Sabbir Hossain',
      phone: '+8801712000002',
      isCentral: false
    });

    const whRajshahi = await Warehouse.create({
      name: 'Rajshahi Cold Storage & Agro Aggregation Hub',
      code: 'WH-RAJSHAHI-03',
      district: 'Rajshahi',
      address: 'Sardah Road, Charghat, Rajshahi-6270',
      capacityTons: 2000,
      contactPerson: 'Engr. Masum Billah',
      phone: '+8801712000003',
      isCentral: false
    });

    const whBogura = await Warehouse.create({
      name: 'Bogura Regional Grain Depot & Sorting Yard',
      code: 'WH-BOGURA-04',
      district: 'Bogura',
      address: 'Sherpur Highway Crossing, Bogura-5840',
      capacityTons: 2500,
      contactPerson: 'Kabir Ahmed',
      phone: '+8801712000004',
      isCentral: false
    });

    // 2. Verified Partner Farmers across Bangladesh
    const farmerMokbul = await Farmer.create({
      name: 'Al-Haj Mokbul Hossain',
      banglaName: 'আলহাজ্ব মকবুল হোসেন',
      phone: '+8801713554433',
      email: 'mokbul.farmer@dhansiriagro.com',
      district: 'Rajshahi',
      upazila: 'Charghat',
      village: 'Baneshwar',
      farmName: 'Padma Riverside Heritage Mango Orchard',
      farmLocation: 'Charghat, Rajshahi',
      primaryCrops: ['Himsagar Mango', 'Amrupali Mango', 'Fazli Mango'],
      farmSizeAcres: 15,
      estimatedAnnualCapacity: '45 Metric Tons Mangoes',
      experienceYears: 24,
      verificationStatus: 'Verified',
      bio: 'Master orchardist cultivating naturally ripened, export-standard Himsagar and Amrupali mangoes without harmful carbide or ripening chemicals.',
      notes: 'Longstanding partner since 2018. Tree-ripened crop protocol strictly adhered to.'
    });

    const farmerNurul = await Farmer.create({
      name: 'Md. Nurul Islam',
      banglaName: 'মো. নজরুল ইসলাম',
      phone: '+8801718223344',
      email: 'nurul.farmer@dhansiriagro.com',
      district: 'Dinajpur',
      upazila: 'Sadar',
      village: 'Mashimpur',
      farmName: 'Mashimpur Royal Litchi & Aromatic Paddy Estate',
      farmLocation: 'Mashimpur, Dinajpur',
      primaryCrops: ['Bedana Litchi', 'China-3 Litchi', 'Chinigura Paddy'],
      farmSizeAcres: 10,
      estimatedAnnualCapacity: '500,000 Pieces Litchi / 20 Metric Tons Paddy',
      experienceYears: 18,
      verificationStatus: 'Verified',
      bio: 'Renowned litchi producer in Mashimpur, famous for small-seed Bedana variety with high brix sweetness index and fragrant Chinigura aromatic paddy.',
      notes: 'Supplies premium grade A Bedana litchi directly to Dhansiri seasonal distribution network.'
    });

    const farmerAlAmin = await Farmer.create({
      name: 'Al-Amin Pramanik',
      banglaName: 'আল-আমিন প্রামাণিক',
      phone: '+8801716998877',
      district: 'Bogura',
      upazila: 'Sherpur',
      village: 'Khamarpara',
      farmName: 'Pramanik Agro & Grain Farms',
      farmLocation: 'Sherpur, Bogura',
      primaryCrops: ['Yellow Hybrid Corn / Maize', 'Diamond Potatoes', 'Winter Vegetables'],
      farmSizeAcres: 25,
      estimatedAnnualCapacity: '80 Metric Tons Maize / 120 Metric Tons Potatoes',
      experienceYears: 14,
      verificationStatus: 'Verified',
      bio: 'Modern grain producer utilizing moisture-controlled harvesting and mechanical shelling for high-grade yellow maize.',
      notes: 'Primary supplier for feed and milling grade yellow corn.'
    });

    const farmerKarim = await Farmer.create({
      name: 'Abdul Karim Mondol',
      banglaName: 'আব্দুল করিম মণ্ডল',
      phone: '+8801715443322',
      district: 'Kushtia',
      upazila: 'Kumarkhali',
      farmName: 'Gorai Silt Basin Agro Estate',
      primaryCrops: ['Deshi Masoor Dal', 'Miniket Paddy', 'Mustard Seed'],
      farmSizeAcres: 12,
      estimatedAnnualCapacity: '15 Metric Tons Pulses / 35 Metric Tons Paddy',
      experienceYears: 20,
      verificationStatus: 'Verified',
      bio: 'Cultivates indigenous high-protein red lentils and premium slender grain Miniket in the fertile silt soils along the Gorai river.',
      notes: 'Supplies natural unpolished Masoor Dal.'
    });

    // 3. System Users
    const superAdmin = await User.create({
      name: 'Al-Haj Rafiqul Islam',
      email: 'admin@dhansiriagro.com',
      password: 'AdminPassword2026!',
      phone: '+8801711000000',
      role: ROLES.SUPER_ADMIN,
      pricingTier: PRICING_TIERS.DISTRIBUTOR,
      status: 'Active',
      isEmailVerified: true
    });

    const warehouseStaff = await User.create({
      name: 'Anwar Hossain',
      email: 'staff@dhansiriagro.com',
      password: 'StaffPassword2026!',
      phone: '+8801711222333',
      role: ROLES.STAFF,
      pricingTier: PRICING_TIERS.RETAIL,
      status: 'Active',
      isEmailVerified: true
    });

    const retailCustomer = await User.create({
      name: 'Mahmudul Hasan Tanvir',
      email: 'customer@dhansiriagro.com',
      password: 'Customer2026!',
      phone: '+8801719887766',
      role: ROLES.CUSTOMER,
      pricingTier: PRICING_TIERS.RETAIL,
      status: 'Active',
      isEmailVerified: true,
      addresses: [{
        recipientName: 'Mahmudul Hasan Tanvir',
        phone: '+8801719887766',
        division: 'Dhaka',
        district: 'Dhaka',
        upazila: 'Gulshan',
        streetAddress: 'House 14, Road 113/A, Gulshan-2',
        postalCode: '1212',
        isDefault: true
      }]
    });

    const wholesaleCustomer = await User.create({
      name: 'Engr. Jashim Uddin',
      email: 'b2b@dhansiriagro.com',
      password: 'Wholesale2026!',
      phone: '+8801715000999',
      role: ROLES.WHOLESALE_CUSTOMER,
      pricingTier: PRICING_TIERS.WHOLESALE,
      status: 'Active',
      isEmailVerified: true,
      businessProfile: {
        companyName: 'Bhai Bhai Super Market & Food Supplies',
        businessType: 'Supermarket Chain & Restaurant Distributor',
        tradeLicenseNumber: 'TRAD/DNCC/024881/2024',
        creditLimit: 500000,
        paymentTermsDays: 15,
        isApproved: true
      },
      addresses: [{
        recipientName: 'Store Warehouse In-Charge',
        phone: '+8801715000999',
        division: 'Dhaka',
        district: 'Dhaka',
        upazila: 'Uttara',
        streetAddress: 'Sector 3, Commercial Plot 22, Uttara, Dhaka-1230',
        postalCode: '1230',
        isDefault: true
      }]
    });

    // 4. Categories (Broad Agricultural Categories)
    const catFruits = await Category.create({
      name: 'Fresh Fruits & Seasonal Harvest',
      banglaName: 'তাজা ফলমূল ও মৌসুমি ফল',
      slug: 'fresh-fruits',
      description: 'Naturally grown, orchard-fresh Rajshahi mangoes, Dinajpur litchis, and seasonal fruits picked at peak ripeness.',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      icon: 'Apple',
      featured: true,
      isSeasonal: true,
      order: 1
    });

    const catVegetables = await Category.create({
      name: 'Farm-Fresh Vegetables',
      banglaName: 'টাটকা শাকসবজি',
      slug: 'vegetables',
      description: 'Crisp vegetables direct from farm clusters in Bogura, Narsingdi, and Rangpur with minimal handling and zero chemicals.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      icon: 'Carrot',
      featured: true,
      isSeasonal: false,
      order: 2
    });

    const catRice = await Category.create({
      name: 'Premium Rice Products',
      banglaName: 'প্রিমিয়াম চাল',
      slug: 'rice-products',
      description: 'Heritage Aromatic Chinigura, Kalijira, sortex-cleaned Miniket, aged Nazirshail, and wholesome Brown rice.',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      icon: 'Wheat',
      featured: true,
      isSeasonal: false,
      order: 3
    });

    const catGrains = await Category.create({
      name: 'Corn, Grains & Cereals',
      banglaName: 'ভুট্টা, গম ও দানাশস্য',
      slug: 'grains-cereals',
      description: 'Machine-shelled high-grade yellow corn, whole wheat, barley, and bulk cereal grains for retail and feed industries.',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
      icon: 'Wheat',
      featured: true,
      isSeasonal: false,
      order: 4
    });

    const catPulses = await Category.create({
      name: 'Pulses & Legumes',
      banglaName: 'দেশি ডাল ও ছোলা',
      slug: 'pulses-legumes',
      description: 'High-protein Deshi Masoor Dal, small-grain Moong Dal, Chhola, and nutritious whole pulses with zero chemical polish.',
      image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
      icon: 'Leaf',
      featured: true,
      isSeasonal: false,
      order: 5
    });

    const catSpices = await Category.create({
      name: 'Pure Ground Spices',
      banglaName: 'খাঁটি মসলা',
      slug: 'pure-spices',
      description: 'Direct from Pabna and Natore: stone-ground turmeric, vibrant red chili, coriander, cumin, and cold-pressed mustard seeds.',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      icon: 'Flame',
      featured: true,
      isSeasonal: false,
      order: 6
    });

    const catSeeds = await Category.create({
      name: 'Agro Seeds & Saplings',
      banglaName: 'বীজ ও কলম চারা',
      slug: 'seeds-saplings',
      description: 'Certified high-germination vegetable seeds, hybrid grain seeds, and disease-free grafted fruit saplings.',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80',
      icon: 'Sprout',
      featured: false,
      isSeasonal: true,
      order: 7
    });

    // Rice Varieties
    const chinigura = await RiceVariety.create({
      name: 'Chinigura Artisan Aromatic',
      banglaName: 'চিনিগুঁড়া সুবাসিত চাল',
      code: 'CHIN-01',
      originRegion: 'Dinajpur',
      grainType: 'Aromatic Fine Grain',
      processingType: 'Non-Parboiled (Atap)',
      aromaLevel: 'High Natural Aroma',
      grainLengthMm: 4.8,
      amylosePercentage: 22.5,
      description: 'Indigenous micro-grain cultivar with intense natural floral fragrance, traditionally grown in the silt-rich soils of Dinajpur.',
      idealForDishes: ['Royal Morog Polao', 'Kacchi Biryani', 'Firni & Payesh']
    });

    const miniket = await RiceVariety.create({
      name: 'Miniket Double-Parboiled',
      banglaName: 'মিনিকেট সিদ্ধ চাল',
      code: 'MIN-02',
      originRegion: 'Kushtia & Dinajpur',
      grainType: 'Slender Grain',
      processingType: 'Steamed (Double Polished)',
      aromaLevel: 'Non-Aromatic',
      grainLengthMm: 6.9,
      amylosePercentage: 24.0,
      description: 'Long slender white grains with silky luster and less than 0.5% broken ratio, double-steamed for fluffy non-sticky cooked texture.',
      idealForDishes: ['Daily Steamed Rice', 'Bengali Fish Curry Meal']
    });

    // 5. Rich Products across Agricultural Sectors
    const p1 = await Product.create({
      name: 'Rajshahi Premium Himsagar Mango',
      banglaName: 'রাজশাহী স্পেশাল হিমসাগর আম',
      slug: 'rajshahi-premium-himsagar-mango',
      sku: 'MNG-HIM-01',
      shortDescription: 'Naturally tree-ripened, GI-certified Himsagar mangoes from Charghat orchard. Fiberless, aromatic, and heavenly sweet.',
      fullDescription: 'Dhansiri Agro brings authentic Rajshahi Himsagar mangoes directly from our verified partner orchards along the Padma silt basin in Charghat. Handpicked at physiological maturity, Sortex-graded by fruit diameter and brix sweetness, and packaged in ventilated eco-friendly containers without carbide or chemical ripening agents.',
      category: catFruits._id,
      productType: 'Fresh Fruits',
      variety: 'Himsagar',
      brand: 'Dhansiri Agro Heritage Fruits',
      origin: 'Charghat, Rajshahi, Bangladesh',
      district: 'Rajshahi',
      upazila: 'Charghat',
      isSeasonal: true,
      seasonalInfo: {
        seasonName: 'Rajshahi Summer Harvest 2026',
        seasonStart: new Date('2026-05-15'),
        seasonEnd: new Date('2026-06-30'),
        expectedHarvestDate: new Date('2026-05-20'),
        preOrderOpenDate: new Date('2026-04-01'),
        preOrderCloseDate: new Date('2026-05-18'),
        estimatedDelivery: 'Dispatched within 24 hours of tree harvest',
        availabilityStatus: 'Pre-order Open'
      },
      traceability: {
        farmer: farmerMokbul._id,
        farmerName: 'Al-Haj Mokbul Hossain',
        farmName: 'Padma Riverside Heritage Mango Orchard',
        district: 'Rajshahi',
        upazila: 'Charghat',
        harvestBatch: 'HIM-2026-BATCH-01',
        harvestDate: new Date('2026-05-20'),
        procurementDate: new Date('2026-05-21'),
        qualityGrade: 'Grade A - Export / Premium',
        storageConditions: 'Ambient ventilated fruit crates at 18-20°C'
      },
      attributes: [
        { name: 'Brix Sweetness Index', value: '22° - 24° Brix' },
        { name: 'Fiber Content', value: '100% Fiberless Sweet Pulp' },
        { name: 'Chemical Ripening', value: '0% (Carbide Free Certified)' },
        { name: 'Average Fruit Weight', value: '240g - 320g per fruit' }
      ],
      featuredImage: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        {
          variantSku: 'MNG-HIM-05KG',
          title: '5 Kg Family Gift Box',
          unit: 'box',
          quantityOrWeight: 5,
          packagingType: 'Heavy-Duty Corrugated Fruit Box',
          retailPrice: 650,
          discountPrice: 600,
          wholesalePrice: 520,
          distributorPrice: 480,
          stock: 450,
          minWholesaleQty: 10,
          image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80'
        },
        {
          variantSku: 'MNG-HIM-10KG',
          title: '10 Kg Wooden Master Crate',
          unit: 'crate',
          quantityOrWeight: 10,
          packagingType: 'Ventilated Wooden Fruit Crate',
          retailPrice: 1250,
          discountPrice: 1180,
          wholesalePrice: 1020,
          distributorPrice: 950,
          stock: 300,
          minWholesaleQty: 5,
          image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80'
        },
        {
          variantSku: 'MNG-HIM-20KG',
          title: '20 Kg Institutional Bulk Crate',
          unit: 'crate',
          quantityOrWeight: 20,
          packagingType: 'Master Ventilated Commercial Crate',
          retailPrice: 2400,
          wholesalePrice: 1980,
          distributorPrice: 1850,
          stock: 150,
          minWholesaleQty: 3,
          image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80'
        }
      ],
      shelfLife: '5-7 Days upon arrival at room temperature',
      storageAdvice: 'Keep in ventilated dry space. Do not refrigerate until fully yellow and ripe.',
      tags: ['Mango', 'Himsagar', 'Rajshahi', 'Seasonal', 'Fruits', 'Carbide Free'],
      rating: 4.95,
      reviewCount: 48,
      isFeatured: true,
      isBestSeller: true,
      isWholesaleAvailable: true,
      status: 'Published'
    });

    const p2 = await Product.create({
      name: 'Dinajpur Bedana Royal Litchi',
      banglaName: 'দিনাজপুর ঐতিহ্যবাহী বেদানা লিচু',
      slug: 'dinajpur-bedana-royal-litchi',
      sku: 'LTC-BED-02',
      shortDescription: 'Famous Mashimpur Bedana litchis. Tiny seed, succulent thick sweet pulp, and bursting with fresh rose-tinted flavor.',
      fullDescription: 'The pride of Dinajpur horticulture. Bedana litchi from Mashimpur is celebrated for having an exceptionally tiny pinhead seed and extraordinarily thick, aromatic translucent pulp. Harvested before sunrise to retain optimal hydration and natural fruit sugars.',
      category: catFruits._id,
      productType: 'Fresh Fruits',
      variety: 'Bedana',
      brand: 'Dhansiri Agro Heritage Fruits',
      origin: 'Mashimpur, Dinajpur, Bangladesh',
      district: 'Dinajpur',
      upazila: 'Sadar',
      isSeasonal: true,
      seasonalInfo: {
        seasonName: 'Dinajpur Litchi Harvest 2026',
        seasonStart: new Date('2026-05-25'),
        seasonEnd: new Date('2026-06-20'),
        expectedHarvestDate: new Date('2026-05-28'),
        preOrderOpenDate: new Date('2026-04-10'),
        preOrderCloseDate: new Date('2026-05-25'),
        estimatedDelivery: 'Express temperature-safe delivery within 36 hours',
        availabilityStatus: 'Coming Soon'
      },
      traceability: {
        farmer: farmerNurul._id,
        farmerName: 'Md. Nurul Islam',
        farmName: 'Mashimpur Royal Litchi & Aromatic Paddy Estate',
        district: 'Dinajpur',
        upazila: 'Sadar',
        harvestBatch: 'BED-DINAJ-2026-01',
        qualityGrade: 'Grade A - Export / Premium'
      },
      attributes: [
        { name: 'Seed Ratio', value: 'Pinhead Seed (<5% volume)' },
        { name: 'Brix Rating', value: '23.5° Sweetness' },
        { name: 'Pesticide Safe', value: '100% Tested Safe Pre-Harvest' }
      ],
      featuredImage: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&w=800&q=80',
      variants: [
        {
          variantSku: 'LTC-BED-100PC',
          title: '100 Pieces Family Box',
          unit: 'box',
          quantityOrWeight: 100,
          packagingType: 'Ventilated Foliage-Lined Box',
          retailPrice: 650,
          wholesalePrice: 540,
          distributorPrice: 500,
          stock: 350,
          minWholesaleQty: 10
        },
        {
          variantSku: 'LTC-BED-500PC',
          title: '500 Pieces Master Crate',
          unit: 'crate',
          quantityOrWeight: 500,
          packagingType: 'Bamboo Ventilated Crate',
          retailPrice: 3100,
          wholesalePrice: 2600,
          distributorPrice: 2450,
          stock: 120,
          minWholesaleQty: 4
        }
      ],
      shelfLife: '3-4 Days fresh with leaf shielding',
      tags: ['Litchi', 'Bedana', 'Dinajpur', 'Seasonal', 'Mashimpur'],
      rating: 5.0,
      reviewCount: 32,
      isFeatured: true,
      isBestSeller: true,
      status: 'Published'
    });

    const p3 = await Product.create({
      name: 'Supreme Dinajpur Chinigura Aromatic Rice',
      banglaName: 'দিনাজপুর স্পেশাল সুবাসিত চিনিগুঁড়া চাল',
      slug: 'supreme-dinajpur-chinigura-aromatic-rice',
      sku: 'DHA-CHN-001',
      shortDescription: 'Naturally aged, micro-grain aromatic rice from Dinajpur. Intensely fragrant, non-parboiled (atap), perfect for Polao and Biryani.',
      fullDescription: 'Cultivated in the pristine river-silt loam of Dinajpur and milled in Dhansiri modern multi-stage Sortex facilities. Aged for 12 months in aerated silos to balance amylose and moisture, ensuring zero clumping and maximum aroma release upon boiling.',
      category: catRice._id,
      productType: 'Rice Products',
      riceVariety: chinigura._id,
      variety: 'Chinigura',
      brand: 'Dhansiri Agro Heritage Rice',
      origin: 'Dinajpur, Bangladesh',
      district: 'Dinajpur',
      isSeasonal: false,
      seasonalInfo: { availabilityStatus: 'Available Now' },
      traceability: {
        farmer: farmerNurul._id,
        farmName: 'Mashimpur Estate',
        district: 'Dinajpur',
        harvestBatch: 'DHA-CHIN-2025-A1',
        qualityGrade: 'Grade A - Premium Sortex',
        storageConditions: 'Moisture Sealed Silo at 13.0% Moisture'
      },
      attributes: [
        { name: 'Aroma', value: '100% Natural Floral Fragrance' },
        { name: 'Broken Grain Ratio', value: '< 0.8% Ultra Clean' },
        { name: 'Moisture Content', value: '12.8% Verified' }
      ],
      featuredImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      variants: [
        {
          variantSku: 'RIC-CHI-01KG',
          title: '1 Kg Vacuum Foil Pouch',
          unit: 'kg',
          quantityOrWeight: 1,
          packagingType: 'Multi-layer Foil Vacuum Pouch',
          retailPrice: 145,
          wholesalePrice: 122,
          distributorPrice: 115,
          stock: 1200,
          minWholesaleQty: 25
        },
        {
          variantSku: 'DHA-CHN-5KG',
          title: '5 Kg Food-Grade Jute Bag',
          unit: 'kg',
          quantityOrWeight: 5,
          packagingType: 'Food-Grade Jute Bag',
          retailPrice: 720,
          wholesalePrice: 600,
          distributorPrice: 565,
          stock: 650,
          minWholesaleQty: 10
        },
        {
          variantSku: 'RIC-CHI-25KG',
          title: '25 Kg Master Sack',
          unit: 'sack',
          quantityOrWeight: 25,
          packagingType: 'Laminated Woven Poly Sack',
          retailPrice: 3450,
          wholesalePrice: 2950,
          distributorPrice: 2800,
          stock: 380,
          minWholesaleQty: 4
        },
        {
          variantSku: 'RIC-CHI-50KG',
          title: '50 Kg Wholesale Silo Sack',
          unit: 'sack',
          quantityOrWeight: 50,
          packagingType: 'Master Commercial Jute Sack',
          retailPrice: 6800,
          wholesalePrice: 5800,
          distributorPrice: 5500,
          stock: 200,
          minWholesaleQty: 2
        }
      ],
      shelfLife: '24 Months in dry storage',
      tags: ['Chinigura', 'Rice', 'Aromatic', 'Polao', 'Dinajpur'],
      rating: 4.98,
      reviewCount: 65,
      isFeatured: true,
      isBestSeller: true,
      status: 'Published'
    });

    const p4 = await Product.create({
      name: 'Kushtia Sortex Slender Miniket Rice',
      banglaName: 'কুষ্টিয়া সিল্কি মিনিকেট সিদ্ধ চাল',
      slug: 'kushtia-sortex-slender-miniket-rice',
      sku: 'DHA-MIN-002',
      shortDescription: 'Double-parboiled, crystal-white long slender grain. High fluffiness, light on stomach, everyday gourmet staple.',
      fullDescription: 'Selected from Kushtia and Dinajpur paddy belts, processed through optical laser sorters for zero black or chalky grains. Cooks into long, distinct, non-sticky rice suitable for daily family lunch and commercial dining.',
      category: catRice._id,
      productType: 'Rice Products',
      riceVariety: miniket._id,
      variety: 'Miniket',
      brand: 'Dhansiri Agro Fine Rice',
      origin: 'Kushtia, Bangladesh',
      district: 'Kushtia',
      isSeasonal: false,
      seasonalInfo: { availabilityStatus: 'Available Now' },
      featuredImage: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
      variants: [
        {
          variantSku: 'RIC-MIN-05KG',
          title: '5 Kg Food-Grade Jute Bag',
          unit: 'kg',
          quantityOrWeight: 5,
          packagingType: 'Food-Grade Jute Bag',
          retailPrice: 375,
          wholesalePrice: 310,
          distributorPrice: 295,
          stock: 800,
          minWholesaleQty: 10
        },
        {
          variantSku: 'RIC-MIN-25KG',
          title: '25 Kg Sack',
          unit: 'sack',
          quantityOrWeight: 25,
          packagingType: 'Non-Woven Poly Sack',
          retailPrice: 1820,
          wholesalePrice: 1540,
          distributorPrice: 1470,
          stock: 500,
          minWholesaleQty: 5
        },
        {
          variantSku: 'RIC-MIN-50KG',
          title: '50 Kg Master Sack',
          unit: 'sack',
          quantityOrWeight: 50,
          packagingType: 'Master Commercial Jute Sack',
          retailPrice: 3600,
          wholesalePrice: 3050,
          distributorPrice: 2900,
          stock: 400,
          minWholesaleQty: 2
        }
      ],
      shelfLife: '12 Months',
      tags: ['Miniket', 'Rice', 'Kushtia', 'Daily Rice'],
      rating: 4.88,
      reviewCount: 54,
      isFeatured: true,
      isBestSeller: true,
      status: 'Published'
    });

    const p5 = await Product.create({
      name: 'Northern Yellow Hybrid Corn / Maize (ভুট্টা)',
      banglaName: 'উত্তরবঙ্গের হাইব্রিড হলুদ ভুট্টা দানা',
      slug: 'northern-yellow-hybrid-corn-maize',
      sku: 'GRN-CRN-05',
      shortDescription: 'Machine-shelled and solar-dried premium yellow maize grains. Low moisture (<13.5%), high starch, zero aflatoxin.',
      fullDescription: 'Grown across Sherpur Bogura and Dinajpur grain fields. Ideal for commercial poultry feed mills, corn flour milling, starch production, or animal feed wholesale. Carefully cleaned of husks and stones.',
      category: catGrains._id,
      productType: 'Grains & Cereals',
      variety: 'Hybrid Yellow Maize-301',
      brand: 'Dhansiri Agro Bulk Commodities',
      origin: 'Sherpur, Bogura, Bangladesh',
      district: 'Bogura',
      upazila: 'Sherpur',
      isSeasonal: true,
      seasonalInfo: {
        seasonName: 'Kharif Harvest 2026',
        availabilityStatus: 'Available Now'
      },
      traceability: {
        farmer: farmerAlAmin._id,
        farmerName: 'Al-Amin Pramanik',
        farmName: 'Pramanik Agro & Grain Farms',
        district: 'Bogura',
        harvestBatch: 'CRN-BOG-2026-01',
        qualityGrade: 'Grade A - Commercial / Feed & Food Grade'
      },
      attributes: [
        { name: 'Moisture Percentage', value: '13.2% Machine Dried' },
        { name: 'Foreign Matter', value: '< 1.0%' },
        { name: 'Grain Color', value: 'Deep Golden Yellow' }
      ],
      featuredImage: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
      variants: [
        {
          variantSku: 'GRN-CRN-01KG',
          title: '1 Kg Retail Pack',
          unit: 'kg',
          quantityOrWeight: 1,
          packagingType: 'Poly Bag',
          retailPrice: 45,
          wholesalePrice: 38,
          distributorPrice: 35,
          stock: 600,
          minWholesaleQty: 50
        },
        {
          variantSku: 'GRN-CRN-50KG',
          title: '50 Kg Commercial Sack',
          unit: 'sack',
          quantityOrWeight: 50,
          packagingType: 'Heavy Woven Poly Sack',
          retailPrice: 1650,
          wholesalePrice: 1420,
          distributorPrice: 1350,
          stock: 250,
          minWholesaleQty: 5
        },
        {
          variantSku: 'GRN-CRN-1000KG',
          title: '1 Metric Ton Bulk Silo Lot',
          unit: 'metric ton',
          quantityOrWeight: 1000,
          packagingType: 'Bulk Master Container / 20x 50kg Sacks',
          retailPrice: 32000,
          discountPrice: 31500,
          wholesalePrice: 28000,
          distributorPrice: 26800,
          stock: 35,
          minWholesaleQty: 1
        }
      ],
      shelfLife: '18 Months in moisture-controlled silos',
      tags: ['Corn', 'Maize', 'Bogura', 'Grains', 'Bulk Wholesale', 'Metric Ton'],
      rating: 4.9,
      reviewCount: 22,
      isFeatured: true,
      isWholesaleAvailable: true,
      status: 'Published'
    });

    const p6 = await Product.create({
      name: 'Bogura Diamond Fresh Harvest Potatoes',
      banglaName: 'বগুড়ার ডায়মন্ড জাতের নতুন আলু',
      slug: 'bogura-diamond-fresh-harvest-potatoes',
      sku: 'VEG-POT-06',
      shortDescription: 'Smooth-skin, disease-free Diamond potatoes from the fertile alluvial soil of Bogura. Crisp, sweet, and excellent cooking texture.',
      fullDescription: 'Directly sourced from farmer cooperative fields in Bogura. Machine-sorted to uniform sizing (50mm+), sand-dusted for natural moisture retention without refrigeration chemical sprays.',
      category: catVegetables._id,
      productType: 'Vegetables',
      variety: 'Diamond Potato',
      brand: 'Dhansiri Agro Fresh Fields',
      origin: 'Sherpur, Bogura, Bangladesh',
      district: 'Bogura',
      isSeasonal: false,
      seasonalInfo: { availabilityStatus: 'Available Now' },
      featuredImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      variants: [
        {
          variantSku: 'VEG-POT-05KG',
          title: '5 Kg Ventilated Mesh Bag',
          unit: 'bag',
          quantityOrWeight: 5,
          packagingType: 'Breathable Mesh Bag',
          retailPrice: 160,
          wholesalePrice: 135,
          distributorPrice: 125,
          stock: 400,
          minWholesaleQty: 10
        },
        {
          variantSku: 'VEG-POT-25KG',
          title: '25 Kg Jute Net Sack',
          unit: 'sack',
          quantityOrWeight: 25,
          packagingType: 'Agri Jute Net Sack',
          retailPrice: 720,
          wholesalePrice: 610,
          distributorPrice: 570,
          stock: 220,
          minWholesaleQty: 4
        },
        {
          variantSku: 'VEG-POT-50KG',
          title: '50 Kg Master Sacks',
          unit: 'sack',
          quantityOrWeight: 50,
          packagingType: 'Master Heavy Sack',
          retailPrice: 1400,
          wholesalePrice: 1180,
          distributorPrice: 1100,
          stock: 150,
          minWholesaleQty: 2
        }
      ],
      shelfLife: '3-4 Weeks in cool, dry storage',
      tags: ['Potato', 'Vegetables', 'Bogura', 'Diamond Potato'],
      rating: 4.82,
      reviewCount: 19,
      isFeatured: false,
      isWholesaleAvailable: true,
      status: 'Published'
    });

    const p7 = await Product.create({
      name: 'Kushtia Deshi Red Lentils (দেশি মসুর ডাল)',
      banglaName: 'কুষ্টিয়ার খাঁটি দেশি ছোট দানার মসুর ডাল',
      slug: 'kushtia-deshi-red-lentils-masoor-dal',
      sku: 'PLS-MAS-07',
      shortDescription: 'Indigenous small-grain unpolished Masoor Dal. Cooked in 15 minutes, rich in natural dietary fiber and plant protein.',
      fullDescription: 'Unlike chemically polished import lentils, Dhansiri Deshi Masoor Dal is grown along the Gorai river silt plains of Kushtia. Milled traditionally without synthetic wax or oil coating, retaining high aroma and sweet earthy flavor upon cooking.',
      category: catPulses._id,
      productType: 'Pulses & Legumes',
      variety: 'Deshi Small Grain Masoor',
      brand: 'Dhansiri Agro Pure Pulses',
      origin: 'Kumarkhali, Kushtia, Bangladesh',
      district: 'Kushtia',
      isSeasonal: false,
      seasonalInfo: { availabilityStatus: 'Available Now' },
      traceability: {
        farmer: farmerKarim._id,
        farmerName: 'Abdul Karim Mondol',
        farmName: 'Gorai Silt Basin Agro Estate',
        district: 'Kushtia',
        harvestBatch: 'MAS-KUSH-2025-02',
        qualityGrade: 'Grade A - Pure Unpolished'
      },
      featuredImage: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
      variants: [
        {
          variantSku: 'PLS-MAS-01KG',
          title: '1 Kg Vacuum Pouch',
          unit: 'kg',
          quantityOrWeight: 1,
          packagingType: 'Vacuum Sealed Food Pouch',
          retailPrice: 140,
          wholesalePrice: 118,
          distributorPrice: 110,
          stock: 550,
          minWholesaleQty: 25
        },
        {
          variantSku: 'PLS-MAS-05KG',
          title: '5 Kg Jute Bag',
          unit: 'kg',
          quantityOrWeight: 5,
          packagingType: 'Food-Grade Jute Bag',
          retailPrice: 680,
          wholesalePrice: 575,
          distributorPrice: 540,
          stock: 280,
          minWholesaleQty: 10
        },
        {
          variantSku: 'PLS-MAS-25KG',
          title: '25 Kg Master Sack',
          unit: 'sack',
          quantityOrWeight: 25,
          packagingType: 'Laminated Master Poly Sack',
          retailPrice: 3250,
          wholesalePrice: 2780,
          distributorPrice: 2650,
          stock: 140,
          minWholesaleQty: 4
        }
      ],
      shelfLife: '18 Months',
      tags: ['Lentils', 'Masoor Dal', 'Kushtia', 'Pulses', 'Pure'],
      rating: 4.92,
      reviewCount: 38,
      isFeatured: true,
      isBestSeller: true,
      status: 'Published'
    });

    const p8 = await Product.create({
      name: 'Pabna Stone-Ground Pure Turmeric Powder',
      banglaName: 'পাবনার জাত খাঁটি হলুদ গুঁড়া',
      slug: 'pabna-stone-ground-pure-turmeric-powder',
      sku: 'SPC-TUR-08',
      shortDescription: '100% pure curcumin-rich turmeric roots from Ishwardi Pabna. Stone-milled at low temperatures to preserve natural medicinal oils.',
      fullDescription: 'Zero artificial yellow dyes, zero lead chromate, zero starch fillers. Hand-sorted sun-dried turmeric fingers ground using traditional slow granite stone mills.',
      category: catSpices._id,
      productType: 'Spices',
      variety: 'Deshi Shonali Turmeric',
      brand: 'Dhansiri Agro Pure Spices',
      origin: 'Ishwardi, Pabna, Bangladesh',
      district: 'Pabna',
      isSeasonal: false,
      seasonalInfo: { availabilityStatus: 'Available Now' },
      featuredImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      variants: [
        {
          variantSku: 'SPC-TUR-250G',
          title: '250g Glass Jar',
          unit: 'g',
          quantityOrWeight: 250,
          packagingType: 'Airtight Glass Spice Jar',
          retailPrice: 95,
          wholesalePrice: 78,
          distributorPrice: 72,
          stock: 450,
          minWholesaleQty: 24
        },
        {
          variantSku: 'SPC-TUR-500G',
          title: '500g Foil Pouch',
          unit: 'g',
          quantityOrWeight: 500,
          packagingType: 'Ziplock Foil Pouch',
          retailPrice: 180,
          wholesalePrice: 148,
          distributorPrice: 138,
          stock: 350,
          minWholesaleQty: 20
        },
        {
          variantSku: 'SPC-TUR-01KG',
          title: '1 Kg Master Foil Pouch',
          unit: 'kg',
          quantityOrWeight: 1,
          packagingType: 'Food-Grade Foil Pouch',
          retailPrice: 350,
          wholesalePrice: 285,
          distributorPrice: 268,
          stock: 220,
          minWholesaleQty: 10
        }
      ],
      shelfLife: '24 Months',
      tags: ['Turmeric', 'Spices', 'Pabna', 'Curcumin', 'Chemical Free'],
      rating: 4.96,
      reviewCount: 41,
      isFeatured: false,
      isBestSeller: true,
      status: 'Published'
    });

    const p9 = await Product.create({
      name: 'Certified Hybrid Vegetable Seed Combo Pack',
      banglaName: '১০ জাতের উন্নত হাইব্রিড সবজি বীজ কম্বো',
      slug: 'certified-hybrid-vegetable-seed-combo-pack',
      sku: 'SED-VEG-09',
      shortDescription: 'Germination rate >90%. Contains certified seeds for Tomato, Chili, Eggplant, Cucumber, Bittergourd, Spinach, and Cauliflower.',
      fullDescription: 'Specially assembled for kitchen gardeners and commercial smallholders. Certified by national seed inspection authority with guaranteed germination vigor and high disease resistance.',
      category: catSeeds._id,
      productType: 'Seeds & Planting Materials',
      variety: 'Agri Combo Pack',
      brand: 'Dhansiri Agro Seeds',
      origin: 'Bogura Seed Multiplication Farm',
      district: 'Bogura',
      isSeasonal: true,
      seasonalInfo: {
        seasonName: 'All Season Planting Combo',
        availabilityStatus: 'Available Now'
      },
      featuredImage: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80',
      variants: [
        {
          variantSku: 'SED-VEG-1PK',
          title: '1 Multi-Variety Seed Pack (10 Pouches)',
          unit: 'box',
          quantityOrWeight: 1,
          packagingType: 'Foil Sealed Germination Pouch Box',
          retailPrice: 220,
          wholesalePrice: 175,
          distributorPrice: 160,
          stock: 300,
          minWholesaleQty: 10
        },
        {
          variantSku: 'SED-VEG-5PK',
          title: '5 Multi-Packs Master Bundle',
          unit: 'box',
          quantityOrWeight: 5,
          packagingType: 'Master Carton Bundle',
          retailPrice: 990,
          wholesalePrice: 820,
          distributorPrice: 750,
          stock: 100,
          minWholesaleQty: 5
        }
      ],
      shelfLife: '24 Months',
      tags: ['Seeds', 'Vegetable Seeds', 'Gardening', 'Hybrid'],
      rating: 4.86,
      reviewCount: 16,
      isFeatured: false,
      status: 'Published'
    });

    const p10 = await Product.create({
      name: 'Amrupali Dwarf Grafted Mango Sapling',
      banglaName: 'উন্নত জাতের আম্রপালি কলম চারাগাছ',
      slug: 'amrupali-dwarf-grafted-mango-sapling',
      sku: 'SPL-AMR-10',
      shortDescription: 'Certified 2-year old grafted sapling with established root ball. Fruits within 18 months, heavy-bearing and compact growth.',
      fullDescription: 'Propagated at our certified Charghat nursery from disease-free mother trees. Ideal for rooftop gardens as well as high-density commercial orchards across Bangladesh.',
      category: catSeeds._id,
      productType: 'Seeds & Planting Materials',
      variety: 'Amrupali Grafted',
      brand: 'Dhansiri Agro Nurseries',
      origin: 'Charghat Nursery, Rajshahi',
      district: 'Rajshahi',
      isSeasonal: true,
      seasonalInfo: {
        seasonName: 'Monsoon Planting Season',
        availabilityStatus: 'Available Now'
      },
      featuredImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      variants: [
        {
          variantSku: 'SPL-AMR-01PC',
          title: '1 Grafted Sapling in Eco Grow Bag',
          unit: 'piece',
          quantityOrWeight: 1,
          packagingType: 'Perforated Agri Root Bag',
          retailPrice: 180,
          wholesalePrice: 145,
          distributorPrice: 130,
          stock: 250,
          minWholesaleQty: 20
        },
        {
          variantSku: 'SPL-AMR-05PC',
          title: '5 Saplings Commercial Bundle',
          unit: 'bundle',
          quantityOrWeight: 5,
          packagingType: 'Crated Root Bundle',
          retailPrice: 850,
          wholesalePrice: 680,
          distributorPrice: 620,
          stock: 80,
          minWholesaleQty: 5
        }
      ],
      shelfLife: 'Plant within 7 days of delivery',
      tags: ['Sapling', 'Amrupali', 'Mango', 'Nursery', 'Grafted'],
      rating: 4.9,
      reviewCount: 14,
      isFeatured: false,
      status: 'Published'
    });

    // 6. Quality Inspection Records
    await QualityInspection.create({
      inspectionNumber: 'QC-260515-001',
      batchNumber: 'HIM-2026-BATCH-01',
      product: p1._id,
      productName: p1.name,
      farmer: farmerMokbul._id,
      warehouse: whRajshahi._id,
      inspectedBy: superAdmin._id,
      inspectorName: 'Dr. Shahinur Rahman (Quality Lead)',
      moisturePercentage: 11.5,
      brixSweetnessDegree: 23.2,
      qualityGrade: 'Grade A - Export / Premium',
      status: 'Accepted',
      sampleQuantityTested: '10 fruits sampled per 100 crates',
      acceptedQuantity: 450,
      rejectedQuantity: 4,
      unit: 'crate',
      carbideFreeCertified: true,
      bstiCompliant: true,
      remarks: 'Excellent brix sweetness, zero chemical ripening residue, flawless skin.'
    });

    await QualityInspection.create({
      inspectionNumber: 'QC-260510-002',
      batchNumber: 'CRN-BOG-2026-01',
      product: p5._id,
      productName: p5.name,
      farmer: farmerAlAmin._id,
      warehouse: whBogura._id,
      inspectedBy: warehouseStaff._id,
      inspectorName: 'Md. Anisur Zaman (Grain Inspector)',
      moisturePercentage: 13.1,
      foreignMatterPercentage: 0.2,
      brokenRatioPercentage: 0.5,
      qualityGrade: 'Grade A - Commercial / Feed & Food Grade',
      status: 'Accepted',
      acceptedQuantity: 50,
      rejectedQuantity: 0,
      unit: 'metric ton',
      remarks: 'Moisture well below 14% threshold. Ideal for long silo preservation.'
    });

    // 7. Inventory Setup
    const allProducts = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10];
    for (const prod of allProducts) {
      for (const v of prod.variants) {
        await Inventory.create({
          product: prod._id,
          variantSku: v.variantSku,
          warehouse: whDhaka._id,
          stock: Math.round(v.stock * 0.6),
          reservedStock: 2,
          lowStockThreshold: 15,
          lastRestockedAt: new Date()
        });

        await Inventory.create({
          product: prod._id,
          variantSku: v.variantSku,
          warehouse: whDinajpur._id,
          stock: Math.round(v.stock * 0.4),
          reservedStock: 0,
          lowStockThreshold: 20,
          lastRestockedAt: new Date()
        });
      }
    }

    // 8. Realistic Coupons
    await Coupon.create({
      code: 'DHANSIRI100',
      title: 'Flat ৳ 100 Discount on Minimum ৳ 500 Order',
      discountType: 'FixedAmount',
      discountValue: 100,
      minOrderAmount: 500,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-12-31'),
      usageLimit: 1000,
      usedCount: 5,
      isActive: true
    });

    await Coupon.create({
      code: 'DHANSIRI10',
      title: '10% Launch discount for online agricultural orders',
      discountType: 'Percentage',
      discountValue: 10,
      maxDiscountAmount: 500,
      minOrderAmount: 1000,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-12-31'),
      usageLimit: 1000,
      usedCount: 15,
      isActive: true
    });

    await Coupon.create({
      code: 'HARVEST2026',
      title: 'Flat ৳ 200 discount on seasonal fruit pre-orders',
      discountType: 'FixedAmount',
      discountValue: 200,
      minOrderAmount: 1500,
      validFrom: new Date('2026-04-01'),
      validUntil: new Date('2026-07-31'),
      usageLimit: 500,
      usedCount: 28,
      isActive: true
    });

    // 9. Quotations
    await Quotation.create({
      quotationNumber: 'QT-260510-101',
      customer: wholesaleCustomer._id,
      companyName: 'Bhai Bhai Super Market & Food Supplies',
      contactPerson: 'Engr. Jashim Uddin',
      phone: '+8801715000999',
      email: 'b2b@dhansiriagro.com',
      district: 'Dhaka',
      deliveryAddress: 'Sector 3, Commercial Plot 22, Uttara, Dhaka-1230',
      items: [
        {
          product: p3._id,
          productName: p3.name,
          variantSku: 'RIC-CHI-50KG',
          bagQuantity: 50,
          bagWeightKg: 50,
          totalKg: 2500,
          unitPrice: 5700,
          totalPrice: 285000
        },
        {
          product: p5._id,
          productName: p5.name,
          variantSku: 'GRN-CRN-1000KG',
          bagQuantity: 5,
          bagWeightKg: 1000,
          totalKg: 5000,
          unitPrice: 27500,
          totalPrice: 137500
        }
      ],
      subtotal: 422500,
      specialDiscount: 7500,
      deliveryCharge: 3000,
      grandTotal: 418000,
      validUntil: new Date('2026-06-30'),
      termsAndConditions: '1. Sourced directly from Dinajpur & Bogura Hubs.\n2. Payment: 50% advance, balance on delivery.\n3. Goods inspected and moisture certified.',
      status: 'Sent'
    });

    // 10. Customer Orders
    const sampleOrder = await Order.create({
      orderNumber: 'DHA-260511-1001',
      invoiceNumber: 'INV-260511-1001',
      customer: retailCustomer._id,
      items: [
        {
          product: p1._id,
          productName: p1.name,
          variantSku: 'MNG-HIM-05KG',
          variantTitle: `${p1.name} - 5 Kg Family Gift Box`,
          unit: 'box',
          quantityOrWeight: 5,
          packagingType: 'Heavy-Duty Corrugated Fruit Box',
          weightKg: 5,
          quantity: 2,
          unitPrice: 600,
          totalPrice: 1200,
          image: p1.featuredImage
        },
        {
          product: p3._id,
          productName: p3.name,
          variantSku: 'RIC-CHI-05KG',
          variantTitle: `${p3.name} - 5 Kg Food-Grade Jute Bag`,
          unit: 'kg',
          quantityOrWeight: 5,
          packagingType: 'Food-Grade Jute Bag',
          weightKg: 5,
          quantity: 1,
          unitPrice: 720,
          totalPrice: 720,
          image: p3.featuredImage
        }
      ],
      totalWeightKg: 15,
      subtotal: 1920,
      couponDiscount: 192,
      couponCode: 'DHANSIRI10',
      deliveryCharge: 80,
      deliveryMethod: 'Fresh Produce Express',
      grandTotal: 1808,
      shippingAddress: {
        recipientName: 'Mahmudul Hasan Tanvir',
        phone: '+8801719887766',
        division: 'Dhaka',
        district: 'Dhaka',
        upazila: 'Gulshan',
        streetAddress: 'House 14, Road 113/A, Gulshan-2',
        postalCode: '1212'
      },
      orderStatus: ORDER_STATUSES.PROCESSING,
      paymentStatus: PAYMENT_STATUSES.PAID,
      paymentMethod: PAYMENT_METHODS.BKASH,
      paymentReference: 'BKASH-TRX-98218731',
      trackingNumber: 'AGRI-TRK-78901',
      courierPartner: 'Dhansiri Agri-Express Dedicated Cold Fleet',
      statusTimeline: [
        { status: ORDER_STATUSES.PENDING, note: 'Order registered online via bKash.' },
        { status: ORDER_STATUSES.CONFIRMED, note: 'Payment verified and orchard harvest batch allocated.' },
        { status: ORDER_STATUSES.PROCESSING, note: 'Freshly harvested fruits packed in ventilated containers at Rajshahi Hub.' }
      ]
    });

    // 11. Testimonials
    await Testimonial.create({
      author: 'Chef Tariqul Islam',
      designation: 'Executive Chef, The Royal Bengal Grand Hotel',
      company: 'Royal Bengal Hospitality Group, Dhaka',
      rating: 5,
      type: 'Chef & Restaurant',
      quote: 'Dhansiri Chinigura rice is irreplaceable in our Kacchi Biryani. The grain remains completely separate, elongation is exceptional, and natural aroma fills the dining hall. Their seasonal mango procurement is equally phenomenal.',
      isFeatured: true
    });

    await Testimonial.create({
      author: 'Farhana Chowdhury',
      designation: 'Home Chef & Conscious Consumer',
      company: 'Dhanmondi, Dhaka',
      rating: 5,
      type: 'Retail Consumer',
      quote: 'Pre-ordered 20kg of Rajshahi Himsagar mangoes last season. They arrived perfectly packed in wooden crates, 100% carbide-free, and tasted just like the mangoes from my childhood in Rajshahi.',
      isFeatured: true
    });

    // 12. Blog Posts
    await BlogPost.create({
      title: 'A Guide to Bangladesh Legendary Mango Cultivars: From Himsagar to Haribhanga',
      slug: 'bangladesh-legendary-mango-cultivars-guide',
      excerpt: 'Discover the heritage, brix sweetness, harvest periods, and regional origins of Bangladesh most celebrated mango varieties.',
      content: 'Bangladesh produces some of the most aromatic and succulent mangoes in the world. From the early-ripening Himsagar of Rajshahi to the fiberless sweet meat of Rangpur Haribhanga, each variety has a unique regional origin and culinary profile.',
      featuredImage: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      category: 'Seasonal Harvest',
      author: 'Dhansiri Agronomy Research Desk',
      tags: ['Mango', 'Himsagar', 'Agriculture', 'Harvest Calendar'],
      readTimeMinutes: 6,
      isPublished: true
    });

    await BlogPost.create({
      title: 'Preserving Yellow Maize Quality: Moisture Control and Aflatoxin Prevention in Bengal Silos',
      slug: 'preserving-yellow-maize-quality-moisture-control',
      excerpt: 'How mechanized solar drying and sealed aerated silos maintain grade-A yellow corn for Bangladesh feed and food processing industries.',
      content: 'Maintaining grain moisture below 13.5% is crucial in tropical delta climates. At Dhansiri Agro, every batch of corn arriving from Sherpur Bogura undergoes multi-point probe testing before entering our drying towers.',
      featuredImage: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
      category: 'Grain Technology',
      author: 'Engr. Masum Billah',
      tags: ['Corn', 'Maize', 'Grain Silos', 'Quality Control'],
      readTimeMinutes: 5,
      isPublished: true
    });

    // 13. FAQs
    await FAQ.create({
      question: 'How do seasonal fruit pre-orders work for Himsagar mango and Bedana litchi?',
      answer: 'You can pre-book before the harvest starts. When the orchard reaches peak physiological maturity, the fruits are handpicked before sunrise, sorted, packed, and dispatched within 24 hours directly to your doorstep in Dhaka and across Bangladesh.',
      category: 'Seasonal & Delivery',
      order: 1
    });

    await FAQ.create({
      question: 'Are your fruits really 100% free from carbide or chemical ripening agents?',
      answer: 'Yes, absolutely. We partner directly with verified orchardists in Charghat (Rajshahi) and Mashimpur (Dinajpur) under strict contract farming rules. Every incoming batch is lab-tested and verified for zero artificial ripening chemicals.',
      category: 'Quality Assurance',
      order: 2
    });

    await FAQ.create({
      question: 'Can supermarkets and restaurants purchase grains and rice in bulk at wholesale rates?',
      answer: 'Yes! We support commercial procurement, wholesale sack supply (25kg & 50kg), and bulk metric ton shipments with corporate GST/BIN billing, volume tiers, and dedicated freight logistics.',
      category: 'Wholesale & B2B',
      order: 3
    });

    console.log('[Seed] Agricultural platform database successfully populated!');
    console.log('----------------------------------------------------');
    console.log('Admin Credentials:');
    console.log('Email: admin@dhansiriagro.com');
    console.log('Password: AdminPassword2026!');
    console.log('----------------------------------------------------');
    console.log('Wholesale Customer Credentials:');
    console.log('Email: b2b@dhansiriagro.com');
    console.log('Password: Wholesale2026!');
    console.log('----------------------------------------------------');
    console.log('Customer Credentials:');
    console.log('Email: customer@dhansiriagro.com');
    console.log('Password: Customer2026!');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
