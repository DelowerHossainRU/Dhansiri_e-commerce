const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  companyName: { type: String, default: 'Dhansiri Agro Industries Ltd.' },
  companyBanglaName: { type: String, default: 'ধানসিঁড়ি এগ্রো ইন্ডাস্ট্রিজ লিমিটেড' },
  tagline: { type: String, default: 'Pure Grain. Exceptional Taste. Heritage Rice Millers Since 1984.' },
  phonePrimary: { type: String, default: '+880 1711-000000' },
  phoneWholesale: { type: String, default: '+880 1722-111111' },
  email: { type: String, default: 'trade@dhansiriagro.com' },
  salesEmail: { type: String, default: 'orders@dhansiriagro.com' },
  headOfficeAddress: { type: String, default: 'Level 7, Concord Tower, Road 11, Banani, Dhaka-1213, Bangladesh' },
  millAddress: { type: String, default: 'Dhansiri Automatic Rice Mill Complex, Pulhat Industrial Area, Dinajpur-5200' },
  currency: { type: String, default: '৳' },
  currencyCode: { type: String, default: 'BDT' },
  taxRatePercent: { type: Number, default: 0 }, // Rice in BD is usually essential agricultural exempt, configurable
  freeDeliveryThresholdRetail: { type: Number, default: 2500 },
  defaultRetailDeliveryFee: { type: Number, default: 80 },
  wholesaleMinOrderKg: { type: Number, default: 250 },
  announcementBarText: { type: String, default: 'Boro Season Fresh Harvest Sortex Miniket & Kalijira Now Available for Retail & Institutional Supply' },
  announcementBarLink: { type: String, default: '/shop' },
  isAnnouncementBarActive: { type: Boolean, default: true },
  socialLinks: {
    facebook: { type: String, default: 'https://facebook.com/dhansiriagro' },
    linkedin: { type: String, default: 'https://linkedin.com/company/dhansiriagro' },
    youtube: { type: String, default: 'https://youtube.com/@dhansiriagro' },
    whatsapp: { type: String, default: '+8801711000000' }
  },
  businessHours: { type: String, default: 'Saturday – Thursday: 8:00 AM – 8:00 PM (GMT+6)' },

  // Visual Theme & Typography
  activeTheme: {
    type: String,
    enum: [
      'golden-harvest',
      'royal-basmati',
      'emerald-heritage',
      'warm-amber',
      'parchment-gold',
      'terracotta-earth',
      'sage-silk',
      'luxe-saffron',
      'dinajpur-pearl',
      'classic-ivory'
    ],
    default: 'golden-harvest'
  },
  activeFont: {
    type: String,
    enum: ['playfair', 'jakarta', 'cinzel', 'outfit', 'merriweather', 'lora', 'manrope'],
    default: 'playfair'
  },

  // Dynamic Homepage Hero CMS
  heroBadge: { type: String, default: 'Direct From Dinajpur Millers • 100% Sortex Pure' },
  heroTitle: { type: String, default: 'Pure Grain. Exceptional Taste.' },
  heroSubtitle: { type: String, default: 'Harvested from prime alluvial terroirs across North Bengal, double-parboiled with pure steam, and optical Sortex-graded for zero broken kernels. Sustenance for homes, dining, and global trade.' },
  heroPrimaryCtaText: { type: String, default: 'Explore Fresh Harvest' },
  heroPrimaryCtaLink: { type: String, default: '/shop' },
  heroSecondaryCtaText: { type: String, default: 'Wholesale & B2B Inquiry' },
  heroSecondaryCtaLink: { type: String, default: '/wholesale' },
  heroImage: { type: String, default: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80' },
  heroHighlightTag: { type: String, default: 'Prime Harvest Aromatic' },
  heroHighlightTitle: { type: String, default: 'Dinajpur Heritage Chinigura' },
  heroHighlightPrice: { type: String, default: '৳750 / 5kg' },
  heroHighlightDesc: { type: String, default: 'Small-grain indigenous aromatic rice with five-stage optical sorting for pristine white pearls and rich floral bouquet.' },
  heroHighlightLink: { type: String, default: '/products/dhansiri-heritage-dinajpur-chinigura-rice' },
  heroStat1Number: { type: String, default: '13.2%' },
  heroStat1Label: { type: String, default: 'Lab-Stabilized Moisture' },
  heroStat2Number: { type: String, default: '<0.5%' },
  heroStat2Label: { type: String, default: 'Broken Grain Limit' },
  heroStat3Number: { type: String, default: '100%' },
  heroStat3Label: { type: String, default: 'Stone & Husk Free' },
  heroStat4Number: { type: String, default: '40+' },
  heroStat4Label: { type: String, default: 'Years Agro Heritage' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
