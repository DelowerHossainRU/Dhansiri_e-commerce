import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Plus, RotateCw, Search, ArrowDownUp } from 'lucide-react';
import api from '../../api/client';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { formatDate } from '../../utils/format';
import { toast } from 'sonner';

export const AdminInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stocks'); // 'stocks' | 'movements'

  // Adjustment Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustedQty, setAdjustedQty] = useState(10);
  const [adjustType, setAdjustType] = useState('Adjustment');
  const [adjustReason, setAdjustReason] = useState('Silo audit physical recount verification');
  const [submittingAdjust, setSubmittingAdjust] = useState(false);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const [invRes, movRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/inventory/movements?limit=30')
      ]);
      if (invRes.success) setInventory(invRes.data);
      if (movRes.success) setMovements(movRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const openAdjustModal = (item) => {
    setSelectedItem(item);
    setAdjustedQty(10);
    setAdjustType('Adjustment');
    setAdjustReason('Physical silo verification');
    setAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingAdjust(true);
      const res = await api.post('/inventory/adjust', {
        productId: selectedItem.product._id,
        variantSku: selectedItem.variantSku,
        warehouseId: selectedItem.warehouse._id,
        adjustedQty: Number(adjustedQty),
        reason: adjustReason,
        type: adjustType
      });

      if (res.success) {
        toast.success('Stock adjusted & recorded in movement ledger');
        setAdjustModalOpen(false);
        fetchInventoryData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to adjust stock');
    } finally {
      setSubmittingAdjust(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold block mb-1 text-emerald-800">
            Warehouse Operations
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900">
            Silo Stocks & Inventory Movement Ledger
          </h1>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === 'stocks' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('stocks')}
          >
            Warehouse Stock Levels
          </Button>
          <Button
            variant={activeTab === 'movements' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('movements')}
          >
            Movement Audit Ledger
          </Button>
        </div>
      </div>

      {/* Stocks Tab */}
      {activeTab === 'stocks' && (
        <div className="bg-white border border-slate-200 rounded-xs overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Warehouse Depot</th>
                <th className="p-3.5">Product Cultivar</th>
                <th className="p-3.5">Variant SKU</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Alert Level</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="p-4"><Skeleton className="h-6 w-full" /></td></tr>
                ))
              ) : inventory.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No inventory registered.</td></tr>
              ) : (
                inventory.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      {inv.warehouse?.name}
                      <span className="block text-[10px] text-slate-500 font-mono">{inv.warehouse?.code}</span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">{inv.product?.name}</td>
                    <td className="p-3.5 font-mono text-slate-500">{inv.variantSku}</td>
                    <td className="p-3.5 font-bold text-sm">
                      <span className={inv.stock <= inv.lowStockThreshold ? 'text-rose-600' : 'text-emerald-800'}>
                        {inv.stock} units
                      </span>
                    </td>
                    <td className="p-3.5">
                      {inv.stock <= inv.lowStockThreshold ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold text-[10px] rounded-xs border border-rose-200">
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Normal</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => openAdjustModal(inv)}
                        className="px-2.5 py-1 text-white rounded-xs font-semibold hover:opacity-90 text-[11px] shadow-xs"
                        style={{ backgroundColor: 'var(--brand-primary)' }}
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Movements Tab */}
      {activeTab === 'movements' && (
        <div className="bg-white border border-slate-200 rounded-xs overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Cultivar & SKU</th>
                <th className="p-3.5">Depot</th>
                <th className="p-3.5">Quantity Change</th>
                <th className="p-3.5">Reason & Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.map((mov) => (
                <tr key={mov._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 text-slate-500">{formatDate(mov.createdAt)}</td>
                  <td className="p-3.5 font-bold text-slate-900">{mov.type}</td>
                  <td className="p-3.5 font-semibold text-slate-900">
                    {mov.product?.name} ({mov.variantSku})
                  </td>
                  <td className="p-3.5 text-slate-500">{mov.warehouse?.name}</td>
                  <td className="p-3.5 font-mono font-bold text-sm">
                    <span className={mov.quantity > 0 ? 'text-emerald-700' : 'text-rose-600'}>
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    <span>{mov.reason}</span>
                    {mov.referenceId && <span className="block font-mono text-[10px] text-amber-700">Ref: {mov.referenceId}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjustment Modal */}
      {selectedItem && (
        <Modal
          isOpen={adjustModalOpen}
          onClose={() => setAdjustModalOpen(false)}
          title={`Adjust Stock: ${selectedItem.variantSku}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs text-xs space-y-1">
              <div><span className="font-semibold text-slate-600">Product:</span> {selectedItem.product?.name}</div>
              <div><span className="font-semibold text-slate-600">Warehouse:</span> {selectedItem.warehouse?.name}</div>
              <div><span className="font-semibold text-slate-600">Current Stock:</span> <span className="font-bold text-slate-900">{selectedItem.stock}</span></div>
            </div>

            <Select
              label="Adjustment Nature *"
              value={adjustType}
              onChange={(e) => setAdjustType(e.target.value)}
            >
              <option value="Adjustment">Audit Physical Recount (+/-)</option>
              <option value="Damage">Damaged Sack Write-Off (-)</option>
              <option value="Return">Customer Return Restock (+)</option>
              <option value="Purchase">Procurement Silo Intake (+)</option>
            </Select>

            <Input
              label="Quantity Delta (e.g. +20 or -5) *"
              type="number"
              value={adjustedQty}
              onChange={(e) => setAdjustedQty(e.target.value)}
              required
            />

            <Input
              label="Audit Justification Reason *"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="e.g. Monthly physical audit reconciliation"
              required
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="ghost" size="md" onClick={() => setAdjustModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="md" loading={submittingAdjust}>
                Record Stock Movement
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
