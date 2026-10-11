import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, XCircle, Clock, MapPin, Search, Plus, 
  ExternalLink, Phone, ShieldCheck, Sprout, AlertCircle, Edit, Trash2 
} from 'lucide-react';
import api from '../../api/client';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Skeleton } from '../../components/common/Skeleton';
import { toast } from 'sonner';

export const AdminFarmersPage = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Dinajpur');
  const [upazila, setUpazila] = useState('');
  const [village, setVillage] = useState('');
  const [primaryCrops, setPrimaryCrops] = useState('Chinigura Rice, Miniket Paddy');
  const [acreageAcres, setAcreageAcres] = useState(5);
  const [farmingExperienceYears, setFarmingExperienceYears] = useState(10);
  const [isOrganicOrNatural, setIsOrganicOrNatural] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/farmers');
      if (res.success && res.data) {
        setFarmers(res.data);
      }
    } catch (err) {
      console.error('Error fetching farmers:', err);
      toast.error('Failed to load farmer network');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const openCreateModal = () => {
    setEditingFarmer(null);
    setName('');
    setBanglaName('');
    setFarmName('');
    setPhone('');
    setEmail('');
    setDistrict('Dinajpur');
    setUpazila('');
    setVillage('');
    setPrimaryCrops('Chinigura Aromatic Rice, Mustard');
    setAcreageAcres(5);
    setFarmingExperienceYears(12);
    setIsOrganicOrNatural(true);
    setPhotoUrl('https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80');
    setBio('');
    setModalOpen(true);
  };

  const openEditModal = (f) => {
    setEditingFarmer(f);
    setName(f.name);
    setBanglaName(f.banglaName || '');
    setFarmName(f.farmName);
    setPhone(f.phone);
    setEmail(f.email || '');
    setDistrict(f.district);
    setUpazila(f.upazila || '');
    setVillage(f.village || '');
    setPrimaryCrops(Array.isArray(f.primaryCrops) ? f.primaryCrops.join(', ') : f.primaryCrops);
    setAcreageAcres(f.acreageAcres || 1);
    setFarmingExperienceYears(f.farmingExperienceYears || 5);
    setIsOrganicOrNatural(!!f.isOrganicOrNatural);
    setPhotoUrl(f.photoUrl || '');
    setBio(f.bio || '');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const cropsArr = primaryCrops.split(',').map(c => c.trim()).filter(Boolean);
      const payload = {
        name,
        banglaName,
        farmName,
        phone,
        email,
        district,
        upazila,
        village,
        primaryCrops: cropsArr,
        acreageAcres: Number(acreageAcres),
        farmingExperienceYears: Number(farmingExperienceYears),
        isOrganicOrNatural: Boolean(isOrganicOrNatural),
        photoUrl,
        bio
      };

      if (editingFarmer) {
        await api.put(`/farmers/${editingFarmer._id}`, payload);
        toast.success('Partner farmer updated successfully');
      } else {
        await api.post('/farmers', payload);
        toast.success('New partner farmer onboarded successfully');
      }

      setModalOpen(false);
      fetchFarmers();
    } catch (err) {
      toast.error(err.message || 'Failed to save farmer profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/farmers/${id}/verify`, { status });
      if (res.success) {
        toast.success(`Farmer status updated to ${status}`);
        fetchFarmers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update verification status');
    }
  };

  const filteredFarmers = farmers.filter(f => {
    const matchesStatus = statusFilter === 'all' || f.verificationStatus === statusFilter;
    const matchesSearch = !search || 
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.farmName?.toLowerCase().includes(search.toLowerCase()) ||
      f.district?.toLowerCase().includes(search.toLowerCase()) ||
      f.phone?.includes(search);
    return matchesStatus && matchesSearch;
  });

  const verifiedCount = farmers.filter(f => f.verificationStatus === 'verified').length;
  const pendingCount = farmers.filter(f => f.verificationStatus === 'pending').length;
  const totalAcreage = farmers.reduce((sum, f) => sum + (f.acreageAcres || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold block mb-1 text-emerald-800">
            Agricultural Grower Relations
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900">
            Partner Farmers & Regional Agronomists
          </h1>
        </div>

        <Button variant="primary" size="md" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-1.5" /> Onboard Partner Farmer
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-slate-500 block">Total Network</span>
          <span className="font-serif-display text-2xl font-bold text-slate-900">{farmers.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Direct Grower Profiles</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-emerald-800 block">Verified Partners</span>
          <span className="font-serif-display text-2xl font-bold text-emerald-900">{verifiedCount}</span>
          <span className="text-[11px] text-emerald-700 block mt-1">Field Inspected & Certified</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-amber-800 block">Pending Reviews</span>
          <span className="font-serif-display text-2xl font-bold text-amber-900">{pendingCount}</span>
          <span className="text-[11px] text-amber-700 block mt-1">Online Applications</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-slate-500 block">Total Acreage</span>
          <span className="font-serif-display text-2xl font-bold text-slate-900">{totalAcreage} Acres</span>
          <span className="text-[11px] text-slate-500 block mt-1">Combined Farm Land</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['all', 'verified', 'pending', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === st 
                  ? 'bg-emerald-900 text-white shadow-2xs' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search farmer, farm, district, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Farmer & Farm</th>
              <th className="p-3.5">Terroir / District</th>
              <th className="p-3.5">Primary Crops</th>
              <th className="p-3.5">Acreage & Exp</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan="6" className="p-4"><Skeleton className="h-6 w-full" /></td>
                </tr>
              ))
            ) : filteredFarmers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  No farmers found matching query.
                </td>
              </tr>
            ) : (
              filteredFarmers.map((f) => (
                <tr key={f._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={f.photoUrl || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=120&q=80'}
                        alt={f.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{f.name}</span>
                        <span className="text-[11px] text-emerald-800 font-medium">{f.farmName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{f.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-800 block">{f.district}</span>
                    <span className="text-[11px] text-slate-500">{f.upazila || 'Sadar'}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(f.primaryCrops || []).map((crop, cIdx) => (
                        <span key={cIdx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 block">{f.acreageAcres} Acres</span>
                    <span className="text-[11px] text-slate-500">{f.farmingExperienceYears} yrs exp</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      f.verificationStatus === 'verified'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : f.verificationStatus === 'pending'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {f.verificationStatus === 'verified' && <CheckCircle2 className="w-3 h-3" />}
                      {f.verificationStatus === 'pending' && <Clock className="w-3 h-3" />}
                      {f.verificationStatus === 'rejected' && <XCircle className="w-3 h-3" />}
                      {f.verificationStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(f)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                      title="Edit Profile"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {f.verificationStatus !== 'verified' && (
                      <button
                        onClick={() => handleUpdateStatus(f._id, 'verified')}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px] font-bold"
                      >
                        Verify
                      </button>
                    )}
                    {f.verificationStatus !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(f._id, 'rejected')}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-bold"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Farmer Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFarmer ? 'Edit Partner Farmer Profile' : 'Onboard New Partner Farmer'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Farmer Full Name (English) *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="কৃষকের নাম (বাংলা)"
              value={banglaName}
              onChange={(e) => setBanglaName(e.target.value)}
              placeholder="যেমন: হাজী মো. খলিলুর রহমান"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Farm / Agro Estate Name *"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="e.g. Khalil Aromatic Rice Orchards"
              required
            />
            <Input
              label="Contact Phone Number *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="District *"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              options={[
                { value: 'Dinajpur', label: 'Dinajpur (দিনাজপুর)' },
                { value: 'Rajshahi', label: 'Rajshahi (রাজশাহী)' },
                { value: 'Bogura', label: 'Bogura (বগুড়া)' },
                { value: 'Rangpur', label: 'Rangpur (রংপুর)' },
                { value: 'Kushtia', label: 'Kushtia (কুষ্টিয়া)' },
                { value: 'Pabna', label: 'Pabna (পাবনা)' },
                { value: 'Natore', label: 'Natore (নাটোর)' }
              ]}
            />
            <Input
              label="Upazila"
              value={upazila}
              onChange={(e) => setUpazila(e.target.value)}
              placeholder="e.g. Birganj / Bagha"
            />
            <Input
              label="Village / Union"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Sujalpur"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Total Farm Land (Acres)"
              type="number"
              value={acreageAcres}
              onChange={(e) => setAcreageAcres(e.target.value)}
            />
            <Input
              label="Years of Experience"
              type="number"
              value={farmingExperienceYears}
              onChange={(e) => setFarmingExperienceYears(e.target.value)}
            />
            <div className="flex flex-col justify-end pb-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOrganicOrNatural}
                  onChange={(e) => setIsOrganicOrNatural(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                Zero Carbide / Natural Farming
              </label>
            </div>
          </div>

          <Input
            label="Primary Crops (Comma separated)"
            value={primaryCrops}
            onChange={(e) => setPrimaryCrops(e.target.value)}
            placeholder="Chinigura Rice, Miniket, Himsagar Mango, Yellow Corn"
          />

          <Input
            label="Photo URL"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://..."
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Grower Bio / Agronomic Heritage</label>
            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Generations of traditional heritage cultivation, natural composting..."
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={saving}>
              {saving ? 'Saving...' : 'Save Farmer Profile'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
