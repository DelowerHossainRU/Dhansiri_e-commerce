import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, ShoppingCart, Users, Package, AlertTriangle, 
  Briefcase, ArrowUpRight, Scale, Clock, CheckCircle2,
  Sprout, Microscope, FileSpreadsheet
} from 'lucide-react';
import api from '../../api/client';
import { formatPrice, formatDate, formatWeight } from '../../utils/format';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Skeleton } from '../../components/common/Skeleton';
import { Button } from '../../components/common/Button';

export const AdminOverviewPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard-metrics');
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs uppercase tracking-widest font-bold block mb-1 text-emerald-800">
          Executive Telemetry
        </span>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900">
          Milling Operations & Commercial Overview
        </h1>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-xs space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Total Sales Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif-display text-2xl font-bold text-slate-900 block">
            {formatPrice(metrics.totalRevenue || 0)}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            Avg Order: {formatPrice(metrics.averageOrderValue || 0)}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xs space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Total Dispatches</span>
            <ShoppingCart className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-serif-display text-2xl font-bold text-slate-900 block">
            {metrics.totalOrders || 0}
          </span>
          <span className="text-[11px] text-slate-500">
            Pending Dispatch: <span className="font-bold text-slate-900">{metrics.pendingOrders || 0}</span>
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xs space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Volume Dispatched</span>
            <Scale className="w-4 h-4 text-emerald-800" />
          </div>
          <span className="font-serif-display text-2xl font-bold text-slate-900 block">
            {metrics.totalTonsSold || 0} MT
          </span>
          <span className="text-[11px] text-slate-500">Metric Tons Out of Silos</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xs space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Low Stock Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-serif-display text-2xl font-bold text-slate-900 block">
            {metrics.lowStockCount || 0}
          </span>
          <span className="text-[11px] text-amber-700 font-medium">Re-order threshold triggered</span>
        </div>
      </div>

      {/* Secondary Status Alert Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs shadow-2xs">
          <div>
            <span className="text-slate-500 block">Partner Farmers</span>
            <span className="font-bold text-base text-slate-900">{metrics.totalFarmers || 0}</span>
            <span className="text-[10px] text-emerald-700 font-semibold">{metrics.verifiedFarmers || 0} Verified</span>
          </div>
          <Link to="/admin/farmers">
            <Button variant="outline" size="sm" className="text-[11px]">
              <Sprout className="w-3.5 h-3.5 mr-1 text-emerald-700" /> Farmers
            </Button>
          </Link>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs shadow-2xs">
          <div>
            <span className="text-slate-500 block">Quality Lab Tests</span>
            <span className="font-bold text-base text-slate-900">{metrics.qualityInspectionsCount || 0}</span>
            <span className="text-[10px] text-emerald-700 font-semibold">BSTI & Sortex Cleared</span>
          </div>
          <Link to="/admin/quality">
            <Button variant="outline" size="sm" className="text-[11px]">
              <Microscope className="w-3.5 h-3.5 mr-1 text-emerald-700" /> Quality
            </Button>
          </Link>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs shadow-2xs">
          <div>
            <span className="text-slate-500 block">Pending B2B & RFQs</span>
            <span className="font-bold text-base text-slate-900">
              {(metrics.pendingWholesale || 0) + (metrics.pendingQuotations || 0)}
            </span>
            <span className="text-[10px] text-amber-700 font-semibold">Requires Action</span>
          </div>
          <Link to="/admin/wholesale">
            <Button variant="outline" size="sm" className="text-[11px]">
              <Briefcase className="w-3.5 h-3.5 mr-1 text-amber-700" /> Trade Desk
            </Button>
          </Link>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs shadow-2xs">
          <div>
            <span className="text-slate-500 block">Audit & Intelligence</span>
            <span className="font-bold text-base text-slate-900">CSV Ledgers</span>
            <span className="text-[10px] text-slate-500">Sales & Silo Export</span>
          </div>
          <Link to="/admin/reports">
            <Button variant="outline" size="sm" className="text-[11px]">
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-700" /> Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Products & Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Selling Varieties */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-xs space-y-4 shadow-xs">
          <h3 className="font-serif-display text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
            Top Dispatched Rice Varieties
          </h3>
          <div className="space-y-3">
            {data?.topProducts?.map((tp, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-slate-100 last:border-none">
                <div>
                  <span className="font-bold text-slate-900 block">{tp._id}</span>
                  <span className="text-[11px] text-slate-500">{tp.totalQuantity} Units / Sacks</span>
                </div>
                <span className="font-serif-display font-bold text-sm text-slate-900">
                  {formatPrice(tp.totalSales)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-xs space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <h3 className="font-serif-display text-base font-bold text-slate-900">
              Recent Direct Customer & Trade Orders
            </h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-emerald-800 hover:underline">
              All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Order</th>
                  <th className="p-2.5">Customer</th>
                  <th className="p-2.5">Total</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentOrders?.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-2.5 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                    <td className="p-2.5">
                      <span className="font-semibold block text-slate-900">{ord.customer?.name || ord.shippingAddress?.recipientName}</span>
                      <span className="text-[10px] text-slate-500">{ord.shippingAddress?.district}</span>
                    </td>
                    <td className="p-2.5 font-bold text-slate-900">{formatPrice(ord.grandTotal)}</td>
                    <td className="p-2.5"><StatusBadge status={ord.orderStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
