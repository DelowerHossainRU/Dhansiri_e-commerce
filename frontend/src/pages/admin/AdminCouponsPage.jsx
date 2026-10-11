import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Calendar } from 'lucide-react';
import api from '../../api/client';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/format';
import { toast } from 'sonner';

export const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState('Percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(1500);
  const [validUntil, setValidUntil] = useState('2028-12-31');

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/coupons');
      if (res.success && res.data) {
        setCoupons(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post('/admin/coupons', {
        code: code.toUpperCase(),
        title,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        validUntil: new Date(validUntil)
      });
      if (res.success) {
        toast.success(`Coupon code ${code.toUpperCase()} created`);
        setModalOpen(false);
        setCode('');
        setTitle('');
        fetchCoupons();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotional coupon code?')) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      toast.success('Coupon removed');
      fetchCoupons();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold block mb-1 text-emerald-800">
            Promotional Engine
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900">
            Campaign Coupons & Discount Codes
          </h1>
        </div>

        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Create Campaign Coupon
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xs overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Code</th>
              <th className="p-3.5">Campaign Title</th>
              <th className="p-3.5">Discount Benefit</th>
              <th className="p-3.5">Min Order</th>
              <th className="p-3.5">Times Used</th>
              <th className="p-3.5">Valid Until</th>
              <th className="p-3.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-mono font-bold text-slate-900 text-sm">{c.code}</td>
                <td className="p-3.5 font-semibold text-slate-900">{c.title}</td>
                <td className="p-3.5 font-bold text-emerald-800">
                  {c.discountType === 'Percentage' ? `${c.discountValue}% Off` : `৳${c.discountValue} Flat Rebate`}
                </td>
                <td className="p-3.5 font-medium text-slate-700">৳{c.minOrderAmount}</td>
                <td className="p-3.5 font-bold text-slate-900">{c.usedCount} times</td>
                <td className="p-3.5 text-slate-500">{formatDate(c.validUntil)}</td>
                <td className="p-3.5">
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xs transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Promotional Coupon Code"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <Input label="Coupon Code *" placeholder="e.g. HARVEST2026" value={code} onChange={(e) => setCode(e.target.value)} required />
          <Input label="Campaign Title *" placeholder="e.g. Spring Harvest Special" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Discount Type *" value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
              <option value="Percentage">Percentage (%)</option>
              <option value="FixedAmount">Fixed Amount (BDT)</option>
            </Select>
            <Input label="Discount Value *" type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Min Order Amount (BDT) *" type="number" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} required />
            <Input label="Expiry Date *" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} required />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="md" loading={submitting}>Publish Coupon</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
