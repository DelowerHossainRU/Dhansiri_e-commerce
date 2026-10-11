const Farmer = require('../models/Farmer');

class FarmerService {
  async getFarmers(query = {}) {
    const { district, crop, verificationStatus, search, limit = 50, page = 1 } = query;
    const filter = { isActive: true };

    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (district) filter.district = new RegExp(district, 'i');
    if (crop) filter.primaryCrops = new RegExp(crop, 'i');
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { banglaName: new RegExp(search, 'i') },
        { farmName: new RegExp(search, 'i') },
        { district: new RegExp(search, 'i') },
        { upazila: new RegExp(search, 'i') }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Farmer.countDocuments(filter);
    const farmers = await Farmer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return { farmers, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getFarmerById(id) {
    const farmer = await Farmer.findById(id);
    if (!farmer) {
      const err = new Error('Farmer profile not found');
      err.statusCode = 404;
      throw err;
    }
    return farmer;
  }

  async applyFarmer(data) {
    data.verificationStatus = 'Pending';
    return await Farmer.create(data);
  }

  async createFarmer(data) {
    return await Farmer.create(data);
  }

  async updateFarmer(id, data) {
    const farmer = await Farmer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!farmer) {
      const err = new Error('Farmer not found');
      err.statusCode = 404;
      throw err;
    }
    return farmer;
  }

  async updateVerification(id, verificationStatus, notes) {
    const farmer = await Farmer.findById(id);
    if (!farmer) {
      const err = new Error('Farmer not found');
      err.statusCode = 404;
      throw err;
    }
    farmer.verificationStatus = verificationStatus;
    if (notes) farmer.notes = notes;
    await farmer.save();
    return farmer;
  }
}

module.exports = new FarmerService();
