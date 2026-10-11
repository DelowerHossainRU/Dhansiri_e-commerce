const QualityInspection = require('../models/QualityInspection');

class QualityService {
  async getInspections(query = {}) {
    const { status, grade, search, limit = 50, page = 1 } = query;
    const filter = {};
    if (status) filter.status = status;
    if (grade) filter.qualityGrade = grade;
    if (search) {
      filter.$or = [
        { batchNumber: new RegExp(search, 'i') },
        { inspectionNumber: new RegExp(search, 'i') },
        { productName: new RegExp(search, 'i') }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await QualityInspection.countDocuments(filter);
    const inspections = await QualityInspection.find(filter)
      .populate('product', 'name sku featuredImage')
      .populate('farmer', 'name farmName district')
      .populate('warehouse', 'name code district')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return { inspections, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getInspectionById(id) {
    const inspection = await QualityInspection.findById(id)
      .populate('product')
      .populate('farmer')
      .populate('warehouse');
    if (!inspection) {
      const err = new Error('Quality inspection record not found');
      err.statusCode = 404;
      throw err;
    }
    return inspection;
  }

  async createInspection(data, inspectorId = null) {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const count = await QualityInspection.countDocuments();
    data.inspectionNumber = `QC-${dateStr}-${count + 101}`;
    if (inspectorId) data.inspectedBy = inspectorId;
    return await QualityInspection.create(data);
  }

  async updateInspection(id, data) {
    const inspection = await QualityInspection.findByIdAndUpdate(id, data, { new: true });
    if (!inspection) {
      const err = new Error('Quality inspection record not found');
      err.statusCode = 404;
      throw err;
    }
    return inspection;
  }
}

module.exports = new QualityService();
