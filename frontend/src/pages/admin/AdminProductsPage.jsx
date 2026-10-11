import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Package, Check, X, Eye, Sprout, Calendar, Scale } from 'lucide-react';
import api from '../../api/client';
import { formatPrice } from '../../utils/format';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Skeleton } from '../../components/common/Skeleton';
import { toast } from 'sonner';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('kg');
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [seasonalStatus, setSeasonalStatus] = useState('Available Now');
  const [riceVariety, setRiceVariety] = useState('');
  const [origin, setOrigin] = useState('Dinajpur, Bangladesh');
  const [processingMethod, setProcessingMethod] = useState('Sortex Cleaned & Naturally Graded');
  const [productType, setProductType] = useState('Agricultural Produce');
  const [featuredImage, setFeaturedImage] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [retailPrice, setRetailPrice] = useState(120);
  const [wholesalePrice, setWholesalePrice] = useState(95);
  const [stock, setStock] = useState(250);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, varRes] = await Promise.all([
        api.get(`/products?limit=50${search ? `&search=${encodeURIComponent(search)}` : ''}`),
        api.get('/catalog/categories'),
        api.get('/catalog/varieties')
      ]);

      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (varRes.success) setVarieties(varRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setBanglaName('');
    setSku(`AGRI-${Date.now().toString().slice(-4)}`);
    setCategory(categories[0]?._id || '');
    setUnit('kg');
    setIsSeasonal(false);
    setSeasonalStatus('Available Now');
    setRiceVariety('');
    setOrigin('Rajshahi / Dinajpur, Bangladesh');
    setProcessingMethod('Field Fresh & Naturally Graded');
    setProductType('Agricultural Produce');
    setFeaturedImage('https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80');
    setShortDescription('');
    setFullDescription('');
    setRetailPrice(120);
    setWholesalePrice(95);
    setStock(200);
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setBanglaName(p.banglaName || '');
    setSku(p.sku);
    setCategory(p.category?._id || p.category);
    setUnit(p.unit || 'kg');
    setIsSeasonal(!!p.isSeasonal);
    setSeasonalStatus(p.seasonalInfo?.status || 'Available Now');
    setRiceVariety(p.riceVariety?._id || p.riceVariety || '');
    setOrigin(p.origin || '');
    setProcessingMethod(p.processingMethod || '');
    setProductType(p.productType || 'Agricultural Produce');
    setFeaturedImage(p.featuredImage);
    setShortDescription(p.shortDescription);
    setFullDescription(p.fullDescription);
    const v = p.variants?.[0] || {};
    setRetailPrice(v.retailPrice || 120);
    setWholesalePrice(v.wholesalePrice || 95);
    setStock(v.stock || 100);
    setModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name,
        banglaName,
        sku,
        category,
        unit,
        isSeasonal,
        seasonalInfo: {
          isSeasonal,
          status: seasonalStatus,
          harvestSeason: isSeasonal ? 'Active Harvest Window' : 'Year-round',
          expectedAvailability: seasonalStatus === 'Pre-order Open' ? 'Pre-order Booking' : 'Immediate Dispatch'
        },
        origin,
        processingMethod,
        productType,
        featuredImage,
        shortDescription,
        fullDescription,
        variants: [
          {
            variantSku: `${sku}-STD`,
            title: `Standard ${unit.toUpperCase()} Lot`,
            weightKg: unit === 'kg' ? 1 : (unit === 'crate' ? 20 : (unit === 'sack' ? 25 : 1)),
            retailPrice: Number(retailPrice),
            wholesalePrice: Number(wholesalePrice),
            distributorPrice: Math.round(Number(wholesalePrice) * 0.93),
            stock: Number(stock),
            packagingType: unit === 'crate' ? 'Ventilated Fruit Crate' : (unit === 'sack' ? 'Food-Grade Jute Sack' : 'Hermetic Seal Pouch')
          }
        ]
      };

      if (riceVariety) {
        payload.riceVariety = riceVariety;
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success('Agricultural product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('New agricultural product added to catalog');
      }

      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product from the catalog?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold block mb-1 text-emerald-800">
            Catalog & Commodity Administration
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900">
            Agricultural Products & Varieties Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage rice cultivars, seasonal fresh fruits, feed maize, pulses, vegetables, and planting materials.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-1.5" /> Add New Agricultural Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by commodity, cultivar, SKU, terroir..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Produce & Terroir</th>
              <th className="p-3.5">SKU & Unit</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Seasonal Status</th>
              <th className="p-3.5">Stock</th>
              <th className="p-3.5">Retail Price</th>
              <th className="p-3.5">Wholesale Rate</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td colSpan="8" className="p-4"><Skeleton className="h-6 w-full" /></td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-slate-500">
                  No agricultural products found.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const firstVar = p.variants?.[0] || {};
                return (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.featuredImage} 
                          alt={p.name} 
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0" 
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{p.name}</span>
                          <span className="text-[11px] text-emerald-800 font-medium">{p.banglaName || p.origin}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-slate-600 block">{p.sku}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Unit: {p.unit || 'kg'}</span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">
                      {p.category?.name || 'Agri Commodity'}
                    </td>
                    <td className="p-3.5">
                      {p.isSeasonal ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          <Calendar className="w-3 h-3 text-amber-700" />
                          {p.seasonalInfo?.status || 'Seasonal'}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Year-Round</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`font-bold ${firstVar.stock <= 20 ? 'text-rose-600' : 'text-slate-900'}`}>
                        {firstVar.stock || 0} {p.unit || 'units'}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {formatPrice(firstVar.retailPrice)} / {p.unit || 'kg'}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-800">
                      {formatPrice(firstVar.wholesalePrice)}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Create / Edit Product */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Agricultural Produce' : 'Add New Agricultural Commodity'}
        size="lg"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Commodity Name (English) *" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="পণ্যের নাম (বাংলা)" value={banglaName} onChange={(e) => setBanglaName(e.target.value)} placeholder="যেমন: চাঁপাইনবাবগঞ্জ হিমসাগর আম" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Primary SKU *" value={sku} onChange={(e) => setSku(e.target.value)} required />
            <Select label="Category *" value={category} onChange={(e) => setCategory(e.target.value)} required>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </Select>
            <Select 
              label="Trading Unit *" 
              value={unit} 
              onChange={(e) => setUnit(e.target.value)}
              options={[
                { value: 'kg', label: 'Kilogram (kg)' },
                { value: 'crate', label: 'Fruit Crate (crate)' },
                { value: 'sack', label: 'Grain Sack (sack)' },
                { value: 'metric ton', label: 'Metric Ton (MT)' },
                { value: 'piece', label: 'Piece / Count (pc)' },
                { value: 'box', label: 'Export Box (box)' },
                { value: 'bundle', label: 'Sapling Bundle (bundle)' },
                { value: 'g', label: 'Gram (g)' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Origin Terroir / Growing Region" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. Rajshahi, Dinajpur, Bogura" />
            <Input label="Featured Image URL *" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} required />
          </div>

          {/* Seasonal Produce Configuration Strip */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSeasonal}
                  onChange={(e) => setIsSeasonal(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                Mark as Seasonal Harvest Produce (e.g. Mango, Litchi, Winter Crop)
              </label>
              {isSeasonal && (
                <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Seasonal Active
                </span>
              )}
            </div>

            {isSeasonal && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Select
                  label="Seasonal Availability Status"
                  value={seasonalStatus}
                  onChange={(e) => setSeasonalStatus(e.target.value)}
                  options={[
                    { value: 'Available Now', label: 'Available Now (তাজা ফসল সরাসরি প্রস্তুত)' },
                    { value: 'Pre-order Open', label: 'Pre-order Open (অগ্রিম বুকিং উন্মুক্ত)' },
                    { value: 'Coming Soon', label: 'Coming Soon (শীঘ্রই আসছে)' },
                    { value: 'Out of Season', label: 'Out of Season (মৌসুম সমাপ্ত)' }
                  ]}
                />
                <Input
                  label="Processing / Quality Standard"
                  value={processingMethod}
                  onChange={(e) => setProcessingMethod(e.target.value)}
                  placeholder="e.g. Tree-ripened, Zero chemical / Sortex Cleaned"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <Input label={`Retail Price / ${unit} (৳) *`} type="number" value={retailPrice} onChange={(e) => setRetailPrice(e.target.value)} required />
            <Input label={`Wholesale Rate / ${unit} (৳) *`} type="number" value={wholesalePrice} onChange={(e) => setWholesalePrice(e.target.value)} required />
            <Input label={`Current Available Stock (${unit}) *`} type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </div>

          <Input label="Short Description *" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required />

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-600 mb-1">
              Agronomic Specifications & Traceability Story *
            </label>
            <textarea
              rows={3}
              required
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detailed soil characteristics, farmer terroir, moisture metrics, Sortex optical grading details..."
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="md" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Agricultural Produce'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
