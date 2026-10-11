import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Truck, CheckCircle2, ChevronRight, Eye, Edit } from 'lucide-react';
import api from '../../api/client';
import { formatPrice, formatDate } from '../../utils/format';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { toast } from 'sonner';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Order for Status Management
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [courierPartner, setCourierPartner] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = '/orders?limit=50';
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;

      const res = await api.get(url);
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const openStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setNewPaymentStatus(ord.paymentStatus);
    setCourierPartner(ord.courierPartner || 'Dhansiri Fleet');
    setTrackingNumber(ord.trackingNumber || '');
    setStatusNote('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await api.put(`/orders/${selectedOrder._id}/status`, {
        orderStatus: newStatus,
        paymentStatus: newPaymentStatus,
        courierPartner,
        trackingNumber,
        note: statusNote
      });

      if (res.success) {
        toast.success(`Order #${selectedOrder.orderNumber} updated to ${newStatus}`);
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold block mb-1 text-emerald-800">
            Fulfillment Logistics
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900">
            Orders & Shipments Management
          </h1>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer phone, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xs text-xs outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700"
          />
        </div>

        <Select
          className="max-w-[200px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Fulfillment Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-xs overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Order Ref</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Customer & Destination</th>
              <th className="p-3.5">Items Summary</th>
              <th className="p-3.5">Total Amount</th>
              <th className="p-3.5">Payment</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={8} className="p-4"><Skeleton className="h-6 w-full" /></td></tr>
              ))
            ) : orders.length === 0 ? (
              <tr><td colSpan={8} className="p-8 text-center text-xs text-slate-500">No orders found matching criteria.</td></tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    {ord.orderNumber}
                    {ord.isWholesaleOrder && (
                      <span className="block text-[9px] uppercase font-bold text-amber-700">B2B Institutional</span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-500">{formatDate(ord.createdAt)}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 block">{ord.shippingAddress?.recipientName}</span>
                    <span className="text-[11px] text-slate-500">{ord.shippingAddress?.phone} • {ord.shippingAddress?.district}</span>
                  </td>
                  <td className="p-3.5">
                    {ord.items?.map((it, idx) => (
                      <div key={idx} className="line-clamp-1">{it.quantity} × {it.variantTitle}</div>
                    ))}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{formatPrice(ord.grandTotal)}</td>
                  <td className="p-3.5">
                    <span className="block font-semibold text-slate-900">{ord.paymentMethod}</span>
                    <StatusBadge status={ord.paymentStatus} />
                  </td>
                  <td className="p-3.5"><StatusBadge status={ord.orderStatus} /></td>
                  <td className="p-3.5">
                    <button
                      onClick={() => openStatusModal(ord)}
                      className="px-2.5 py-1 text-white rounded-xs font-semibold hover:opacity-90 text-[11px] shadow-xs"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Update Order Fulfillment */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Update Fulfillment: ${selectedOrder.orderNumber}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs text-xs space-y-1">
              <div><span className="font-semibold text-slate-600">Recipient:</span> {selectedOrder.shippingAddress?.recipientName} ({selectedOrder.shippingAddress?.phone})</div>
              <div><span className="font-semibold text-slate-600">Address:</span> {selectedOrder.shippingAddress?.streetAddress}, {selectedOrder.shippingAddress?.district}</div>
              <div><span className="font-semibold text-slate-600">Payable:</span> {formatPrice(selectedOrder.grandTotal)} via {selectedOrder.paymentMethod}</div>
            </div>

            <Select
              label="Fulfillment / Order Status *"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </Select>

            <Select
              label="Payment Status *"
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </Select>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Carrier / Fleet Partner"
                value={courierPartner}
                onChange={(e) => setCourierPartner(e.target.value)}
              />
              <Input
                label="Airway Bill / Tracking #"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. DF-EXP-99214"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-600 mb-1">
                Dispatch Note (Visible in Customer Timeline)
              </label>
              <textarea
                rows={2}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="e.g. Sacks sealed and loaded on dispatch van..."
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xs text-xs outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="ghost" size="md" onClick={() => setSelectedOrder(null)}>Cancel</Button>
              <Button type="submit" variant="primary" size="md" loading={updating}>
                Save Fulfillment Status
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
