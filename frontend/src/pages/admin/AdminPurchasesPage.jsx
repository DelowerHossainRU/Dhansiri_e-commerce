import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, FileText, Building2, Truck, Eye } from 'lucide-react';
import api from '../../api/client';
import { formatPrice, formatDate } from '../../utils/format';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Skeleton } from '../../components/common/Skeleton';
import { toast } from 'sonner';

export const AdminPurchasesPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New PO state
  const [supplierId, setSupplierId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [bagQty, setBagQty] = useState(100);
  const [bagWeight, setBagWeight] = useState(25);
  const [unitCostPerKg, setUnitCostPerKg] = useState(55);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const [poRes, supRes, prodRes] = await Promise.all([
        api.get('/inventory/purchases'),
        api.get('/inventory/suppliers'),
        api.get('/products?limit=30')
      ]);
      if (poRes.success) setPurchaseOrders(poRes.data);
      if (supRes.success) {
        setSuppliers(supRes.data);
        if (supRes.data.length > 0) setSupplierId(supRes.data[0]._id);
      }
      if (prodRes.success) {
        setProducts(prodRes.data);
        if (prodRes.data.length > 0) setSelectedProductId(prodRes.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleCreatePO = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const product = products.find(p => p._id === selectedProductId);
      const totalKg = Number(bagQty) * Number(bagWeight);
      const subtotal = totalKg * Number(unitCostPerKg);

      const res = await api.post('/inventory/purchases', {
        supplier: supplierId,
        warehouse: '670868f00000000000000001', // fallback central warehouse or default
        items: [{
          product: product?._id,
          variantSku: product?.variants?.[0]?.variantSku || 'DHA-VAR-01',
          bagQuantity: Number(bagQty),
          bagWeightKg: Number(bagWeight),
          totalKg,
          unitCostPerKg: Number(unitCostPerKg),
          totalCost: subtotal
        }],
        subtotal,
        transportCost: 3500,
        grandTotal: subtotal + 3500,
        supplierInvoiceNumber: `SUP-INV-${Date.now().toString().slice(-4)}`
      });

      if (res.success) {
        toast.success(`Purchase Order created: ${res.data.poNumber}`);
        setCreateModalOpen(false);
        fetchPurchases();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create PO');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReceivePO = async (poId) => {
    if (!window.confirm('Receive this consignment into the warehouse silo? Stock will be automatically updated.')) return;
    try {
      const res = await api.post(`/inventory/purchases/${poId}/receive`, {});
      if (res.success) {
        toast.success('PO Received! Warehouse stock and ledger updated.');
        fetchPurchases();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to receive PO');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold block mb-1 text-emerald-800">
            Raw Grain Procurement
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900">
            Purchase Orders & Silo Intake
          </h1>
        </div>

        <Button variant="primary" size="md" onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Issue Purchase Order
        </Button>
      </div>

      {/* POs Table */}
      <div className="bg-white border border-slate-200 rounded-xs overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">PO Ref</th>
              <th className="p-3.5">Supplier / Cooperative</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Quantity & Tonnage</th>
              <th className="p-3.5">Procurement Total</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="p-4"><Skeleton className="h-6 w-full" /></td></tr>
              ))
            ) : purchaseOrders.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">No procurement orders registered.</td></tr>
            ) : (
              purchaseOrders.map((po) => {
                const totalKg = po.items?.reduce((s, i) => s + (i.totalKg || 0), 0);
                return (
                  <tr key={po._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{po.poNumber}</td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      {po.supplier?.companyName || 'Farmer Cooperative'}
                      <span className="block text-[10px] text-slate-500 font-normal">{po.supplier?.district}</span>
                    </td>
                    <td className="p-3.5 text-slate-500">{formatDate(po.createdAt)}</td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {(totalKg / 1000).toFixed(2)} MT <span className="text-slate-500 font-normal">({totalKg} kg)</span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{formatPrice(po.grandTotal)}</td>
                    <td className="p-3.5"><StatusBadge status={po.status} /></td>
                    <td className="p-3.5">
                      {po.status !== 'Received' ? (
                        <button
                          onClick={() => handleReceivePO(po._id)}
                          className="px-2.5 py-1 text-white rounded-xs font-semibold hover:opacity-90 text-[11px] shadow-xs"
                          style={{ backgroundColor: 'var(--brand-primary)' }}
                        >
                          Receive Intake
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ingested
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Issue PO */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Issue Farmer / Supplier Purchase Order"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreatePO} className="space-y-4">
          <Select
            label="Supplier / Cooperative Partner *"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            required
          >
            {suppliers.map(s => <option key={s._id} value={s._id}>{s.companyName} ({s.district})</option>)}
          </Select>

          <Select
            label="Product Cultivar To Restock *"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
          >
            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="Bags Quantity *" type="number" value={bagQty} onChange={(e) => setBagQty(e.target.value)} required />
            <Select label="Bag Size *" value={bagWeight} onChange={(e) => setBagWeight(Number(e.target.value))}>
              <option value={25}>25 Kg Sack</option>
              <option value={50}>50 Kg Sack</option>
            </Select>
            <Input label="Rate / Kg (BDT) *" type="number" value={unitCostPerKg} onChange={(e) => setUnitCostPerKg(e.target.value)} required />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-600">Estimated Tonnage:</span>
              <span className="font-bold text-slate-900">{((bagQty * bagWeight) / 1000).toFixed(2)} MT</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900">
              <span>Estimated Requisition Cost:</span>
              <span>{formatPrice(bagQty * bagWeight * unitCostPerKg + 3500)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <Button variant="ghost" size="md" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="md" loading={submitting}>
              Issue PO Consignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
