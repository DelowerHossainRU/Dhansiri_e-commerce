const Category = require('../models/Category');
const RiceVariety = require('../models/RiceVariety');
const slugify = require('slugify');

class CatalogService {
  // Categories
  async getCategories(onlyActive = true) {
    const filter = onlyActive ? { isActive: true } : {};
    return await Category.find(filter).sort({ order: 1, name: 1 });
  }

  async createCategory(data) {
    if (!data.slug) {
      data.slug = slugify(data.name, { lower: true, strict: true });
    }
    return await Category.create(data);
  }

  async updateCategory(id, data) {
    if (data.name && !data.slug) {
      data.slug = slugify(data.name, { lower: true, strict: true });
    }
    return await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
  }

  // Rice Varieties
  async getVarieties(onlyActive = true) {
    const filter = onlyActive ? { isActive: true } : {};
    return await RiceVariety.find(filter).sort({ name: 1 });
  }

  async createVariety(data) {
    return await RiceVariety.create(data);
  }

  async updateVariety(id, data) {
    return await RiceVariety.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteVariety(id) {
    return await RiceVariety.findByIdAndDelete(id);
  }
}

module.exports = new CatalogService();
