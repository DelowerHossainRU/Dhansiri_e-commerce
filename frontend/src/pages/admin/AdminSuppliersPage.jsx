import React, { useState, useEffect } from 'react';
import { Plus, Users, Phone, MapPin, Star, Building2 } from 'lucide-react';
import api from '../../api/client';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { toast } from 'sonner';

export const AdminSuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Dinajpur');
  const [address, setAddress] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 15 Days');

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inventory/suppliers');
      if (res.success && res.data) {
        setSuppliers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post('/inventory/suppliers', {
        companyName,
        contactPerson,
        phone,
        email,
        district,
        address,
        paymentTerms
      });
      if (res.success) {
        toast.success('Supplier partner registered successfully');
        setModalOpen(false);
        setCompanyName('');
        setContactPerson('');
        setPhone('');
        setAddress('');
        fetchSuppliers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to register supplier');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold block mb-1 text-emerald-800">
            Agricultural Procurement
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900">
            Farmer Cooperatives & Paddy Suppliers
          </h1>
        </div>

        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Register Supplier Partner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
        ) : suppliers.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-xs text-slate-500">
            No supplier partners registered.
          </div>
        ) : (
          suppliers.map((s) => (
            <div key={s._id} className="bg-white border border-slate-200 p-5 rounded-xs space-y-3 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif-display text-base font-bold text-slate-900">{s.companyName}</h3>
                  <span className="text-xs font-semibold text-emerald-800">{s.contactPerson}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{s.performanceRating || 5.0}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.address}, {s.district}</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 font-medium">
                  Payment Terms: <span className="font-bold text-slate-900">{s.paymentTerms}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register Paddy Supplier / Grower Cooperative"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateSupplier} className="space-y-4">
          <Input label="Cooperative / Company Name *" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          <Input label="Lead Representative / Contact Person *" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input label="District *" value={district} onChange={(e) => setDistrict(e.target.value)} required />
          </div>
          <Input label="Address *" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <Select label="Payment Settlement Terms *" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
            <option value="Net 7 Days">Net 7 Days</option>
            <option value="Net 15 Days">Net 15 Days</option>
            <option value="50% Advance, 50% Delivery">50% Advance, 50% Delivery</option>
          </Select>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="md" loading={submitting}>Register Partner</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
