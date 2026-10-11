import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, CreditCard, Clock, FileText, Truck, ArrowRight, 
  CheckCircle2, Plus, Download, ShieldCheck, ShoppingBag 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { formatPrice, formatDate } from '../../utils/format';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Skeleton } from '../../components/common/Skeleton';
import { toast } from 'sonner';

export const WholesaleDashboardPage = () => {
  const { user, isWholesaleCustomer, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchB2BData = async () => {
      try {
        setLoading(true);
        const [qRes, ordRes] = await Promise.all([
          api.get('/wholesale/quotations'),
          api.get('/orders/my-orders')
        ]);
        if (qRes.success) setQuotations(Array.isArray(qRes.data) ? qRes.data : []);
        if (ordRes.success) setOrders(Array.isArray(ordRes.data) ? ordRes.data : (ordRes.data?.orders || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchB2BData();
  }, [user, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
            B2B Commercial Account Portal
          </span>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-slate-900">
            {user?.businessProfile?.companyName || user?.name}
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Trade License: <span className="font-mono font-semibold text-slate-900">{user?.businessProfile?.tradeLicenseNumber || 'On Record'}</span> • Credit Terms: <span className="font-semibold text-emerald-800">Net {user?.businessProfile?.paymentTermsDays || 15} Days</span>
          </p>
        </div>

        <Link to="/wholesale">
          <Button variant="gold" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> Request New Commercial Quotation
          </Button>
        </Link>
      </div>

      {/* Credit & Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-slate-200 p-5 rounded-xs space-y-1">
          <div className="flex items-center justify-between text-[#71717A] text-xs">
            <span>Approved Credit Line</span>
            <CreditCard className="w-4 h-4 text-emerald-800" />
          </div>
          <span className="font-serif-display text-2xl font-bold text-slate-900 block">
            {formatPrice(user?.businessProfile?.creditLimit || 500000)}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Revolving Corporate Credit</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xs space-y-1">
          <div className="flex items-center justify-between text-[#71717A] text-xs">
            <span>Active Quotations</span>
            <FileText className="w-4 h-4 text-emerald-800" />
          </div>
          <span className="font-serif-display text-2xl font-bold text-slate-900 block">
            {quotations.length}
          </span>
          <span className="text-[11px] text-[#71717A]">Commercial tenders & price locks</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xs space-y-1">
          <div className="flex items-center justify-between text-[#71717A] text-xs">
            <span>Total Orders Fulfilled</span>
            <Truck className="w-4 h-4 text-emerald-800" />
          </div>
          <span className="font-serif-display text-2xl font-bold text-slate-900 block">
            {orders.length}
          </span>
          <span className="text-[11px] text-[#71717A]">Dedicated fleet consignments</span>
        </div>
      </div>

      {/* Quotations List */}
      <div className="space-y-6 mb-12">
        <h3 className="font-serif-display text-lg font-bold text-slate-900 pb-2 border-b border-slate-200">
          Commercial Quotations & Price Proposals
        </h3>

        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : quotations.length === 0 ? (
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-xs text-center text-xs text-[#71717A]">
            No commercial quotations pending. Submit a request to receive discounted pallet or sack rates.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[#4A4744] uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Quotation Ref</th>
                  <th className="p-3.5">Items / Cultivars</th>
                  <th className="p-3.5">Total Weight</th>
                  <th className="p-3.5">Valid Until</th>
                  <th className="p-3.5">Total Due</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE9DF]">
                {quotations.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{q.quotationNumber}</td>
                    <td className="p-3.5">
                      {q.items?.map((it, idx) => (
                        <div key={idx} className="line-clamp-1">{it.bagQuantity} bags of {it.productName}</div>
                      ))}
                    </td>
                    <td className="p-3.5 font-medium">{q.items?.reduce((s, i) => s + (i.totalKg || 0), 0)} Kg</td>
                    <td className="p-3.5 text-[#71717A]">{formatDate(q.validUntil)}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatPrice(q.grandTotal)}</td>
                    <td className="p-3.5"><StatusBadge status={q.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Wholesale Orders History */}
      <div className="space-y-6">
        <h3 className="font-serif-display text-lg font-bold text-slate-900 pb-2 border-b border-slate-200">
          Consignment Deliveries & Invoices
        </h3>

        <div className="bg-white border border-slate-200 rounded-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#4A4744] uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Grand Total</th>
                <th className="p-3.5">Fulfillment Status</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DF]">
              {orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                  <td className="p-3.5 font-mono text-emerald-800">{ord.invoiceNumber || 'INV-PENDING'}</td>
                  <td className="p-3.5 text-[#71717A]">{formatDate(ord.createdAt)}</td>
                  <td className="p-3.5 font-bold text-slate-900">{formatPrice(ord.grandTotal)}</td>
                  <td className="p-3.5"><StatusBadge status={ord.orderStatus} /></td>
                  <td className="p-3.5">
                    <Link to={`/track/${ord.orderNumber}`} className="font-bold text-slate-900 hover:underline">
                      Track Truck
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
