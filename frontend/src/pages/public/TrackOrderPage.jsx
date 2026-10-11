import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import api from '../../api/client';
import { formatPrice, formatDateTime } from '../../utils/format';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatusBadge } from '../../components/common/StatusBadge';
import { toast } from 'sonner';

export const TrackOrderPage = () => {
  const { orderNumber: paramOrderNumber } = useParams();
  const [searchParams] = useSearchParams();
  const [orderNumberInput, setOrderNumberInput] = useState(paramOrderNumber || searchParams.get('num') || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchTrack = async (num, phone) => {
    if (!num.trim()) return;
    try {
      setLoading(true);
      setHasSearched(true);
      const url = `/orders/track/${encodeURIComponent(num.trim())}${phone ? `?phone=${encodeURIComponent(phone.trim())}` : ''}`;
      const res = await api.get(url);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      setOrder(null);
      toast.error(err.message || 'No tracking record found for this order number');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramOrderNumber) {
      fetchTrack(paramOrderNumber);
    }
  }, [paramOrderNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrack(orderNumberInput, phoneInput);
  };

  const statusSteps = [
    'Pending',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const currentStatusIndex = order ? statusSteps.indexOf(order.orderStatus) : -1;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
          Real-Time Fleet & Dispatch
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-slate-900 mb-3">
          Track Your Grain Shipment
        </h1>
        <p className="text-sm text-[#71717A] font-light">
          Enter your official Dhansiri Agro order number to inspect silo staging, optical verification, and carrier transit.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-xs shadow-xs mb-10 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Order Number *"
              placeholder="e.g. DHA-261010-4491"
              value={orderNumberInput}
              onChange={(e) => setOrderNumberInput(e.target.value)}
              required
            />
            <Input
              label="Phone Number (Verification)"
              placeholder="e.g. 01719887766"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="w-full" loading={loading}>
            <Search className="w-4 h-4 mr-1.5" /> Track Grain Shipment
          </Button>
        </form>
      </div>

      {/* Order Tracking Result View */}
      {order && (
        <div className="bg-slate-50 border border-slate-200 rounded-xs p-6 sm:p-8 space-y-8 animate-fadeIn">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider text-[#71717A]">Order Number:</span>
                <span className="font-serif-display text-xl font-bold text-slate-900">{order.orderNumber}</span>
              </div>
              <p className="text-xs text-[#71717A]">
                Carrier Partner: <span className="font-semibold text-slate-900">{order.courierPartner || 'Dhansiri Fleet'}</span>
                {order.trackingNumber && <> • Airway Bill / Tracking: <span className="font-mono font-semibold text-emerald-800">{order.trackingNumber}</span></>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.orderStatus} />
              <StatusBadge status={order.paymentStatus} />
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="py-4">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[#DDD7CD] z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1E382B] z-0 transition-all duration-500"
                style={{
                  width: `${Math.max(0, (currentStatusIndex / (statusSteps.length - 1)) * 100)}%`
                }}
              />

              {statusSteps.map((stepName, idx) => {
                const isPassed = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;
                return (
                  <div key={stepName} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-slate-900 text-white ring-4 ring-[#E5E7EB]'
                          : isPassed
                          ? 'bg-[#1E382B] text-white'
                          : 'bg-white border-2 border-slate-200 text-[#A1A1AA]'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] mt-2 font-semibold text-center hidden md:block ${
                      isCurrent ? 'text-slate-900' : 'text-[#71717A]'
                    }`}>
                      {stepName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Timeline Events */}
          <div className="bg-white border border-slate-200 p-6 rounded-xs">
            <h3 className="font-serif-display text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              Dispatch & Processing Activity Log
            </h3>
            <div className="space-y-4">
              {order.timeline?.map((event, idx) => (
                <div key={idx} className="flex gap-4 items-start text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#9F7E3B] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{event.status}</span>
                      <span className="text-[11px] text-[#71717A]">{formatDateTime(event.timestamp)}</span>
                    </div>
                    {event.note && (
                      <p className="text-[#52525B] mt-0.5 font-light">{event.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasSearched && !order && !loading && (
        <div className="text-center py-12 text-sm text-[#71717A]">
          No matching shipment found. Please verify the order reference number (e.g. DHA-261010-4491).
        </div>
      )}
    </div>
  );
};
