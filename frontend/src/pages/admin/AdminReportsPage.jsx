import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, Download, TrendingUp, Calendar, Filter, 
  Boxes, DollarSign, Scale, ArrowUpRight, CheckCircle2, ShieldCheck 
} from 'lucide-react';
import api from '../../api/client';
import { formatPrice } from '../../utils/format';
import { Button } from '../../components/common/Button';
import { toast } from 'sonner';

export const AdminReportsPage = () => {
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-12-31');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard-metrics');
        if (res.success && res.data) {
          setMetrics(res.data);
        }
      } catch (err) {
        console.error('Failed to load telemetry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const handleDownloadSalesCSV = () => {
    try {
      const token = localStorage.getItem('token');
      const url = `/api/admin/reports/sales?from=${fromDate}&to=${toDate}`;
      // Trigger download via anchor
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `Dhansiri_Sales_Report_${fromDate}_${toDate}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Sales ledger CSV export downloaded successfully');
    } catch (err) {
      toast.error('Failed to export sales CSV');
    }
  };

  const handleDownloadInventoryCSV = () => {
    try {
      const url = `/api/admin/reports/inventory`;
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `Dhansiri_Silo_Inventory_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Inventory balance CSV export downloaded successfully');
    } catch (err) {
      toast.error('Failed to export inventory CSV');
    }
  };

  const categoryBreakdown = [
    { name: 'Grains & Table Rice', share: '46%', volume: '185 MT', revenue: 1420000 },
    { name: 'Fresh Fruits (Mango & Litchi)', share: '24%', volume: '95 MT', revenue: 760000 },
    { name: 'Yellow Feed Maize', share: '18%', volume: '120 MT', revenue: 420000 },
    { name: 'Pulses, Legumes & Spices', share: '12%', volume: '22 MT', revenue: 310000 }
  ];

  const regionalHubs = [
    { hub: 'Dinajpur Central Milling Silo', capacity: '1,200 MT', activeStock: '740 MT', status: 'Optimal' },
    { hub: 'Dhaka Tejgaon Cold-Chain Hub', capacity: '350 MT', activeStock: '210 MT', status: 'Active' },
    { hub: 'Bogura Northern Aggregation Hub', capacity: '800 MT', activeStock: '520 MT', status: 'Optimal' },
    { hub: 'Chattogram Port Transit Facility', capacity: '500 MT', activeStock: '180 MT', status: 'Active' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold block mb-1 text-emerald-800">
            Enterprise Financial Telemetry
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900">
            Business Reporting & Official CSV Exports
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadInventoryCSV}>
            <Boxes className="w-4 h-4 mr-1.5 text-emerald-800" /> Silo Inventory CSV
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownloadSalesCSV}>
            <Download className="w-4 h-4 mr-1.5" /> Full Sales CSV
          </Button>
        </div>
      </div>

      {/* CSV Export Control Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
          <div>
            <h2 className="font-serif-display text-lg font-bold text-slate-900">
              Government Tax & Operational Audit Downloads
            </h2>
            <p className="text-xs text-slate-500">
              Export standardized comma-separated files compatible with Excel, NBR VAT auditing, and ERP accounting systems.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sales Report Card */}
          <div className="bg-[#FAF8F5] p-5 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif-display text-base font-bold text-slate-900">Sales & Dispatch Ledger</h3>
                <p className="text-xs text-slate-500">Customer dispatches, wholesale invoices, BDT revenue & tax breakdowns</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Data
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none"
                />
              </div>
            </div>

            <Button variant="primary" size="md" className="w-full text-xs" onClick={handleDownloadSalesCSV}>
              <Download className="w-4 h-4 mr-1.5" /> Download Sales Ledger (CSV)
            </Button>
          </div>

          {/* Inventory Report Card */}
          <div className="bg-[#FAF8F5] p-5 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif-display text-base font-bold text-slate-900">Multi-Warehouse Inventory Balance</h3>
                <p className="text-xs text-slate-500">Real-time tonnage across Dinajpur, Tejgaon, Bogura & Chattogram hubs</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Silo Sync
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Active Warehouses:</span>
                <span className="font-bold text-slate-900">4 Regional Hubs</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Stored Tonnage:</span>
                <span className="font-bold text-emerald-800">1,650 Metric Tons</span>
              </div>
            </div>

            <Button variant="outline" size="md" className="w-full text-xs bg-white border-slate-300" onClick={handleDownloadInventoryCSV}>
              <Download className="w-4 h-4 mr-1.5" /> Download Warehouse Inventory (CSV)
            </Button>
          </div>
        </div>
      </div>

      {/* Category Performance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-2xs">
          <h3 className="font-serif-display text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Commodity Volume & Revenue Share</span>
            <Scale className="w-4 h-4 text-emerald-800" />
          </h3>

          <div className="space-y-4">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-800 font-semibold">
                  <span>{cat.name}</span>
                  <span className="font-serif-display text-slate-900">{formatPrice(cat.revenue)} ({cat.share})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-800 h-2 rounded-full"
                    style={{ width: cat.share }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Dispatched Tonnage:</span>
                  <span className="font-mono font-medium">{cat.volume}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouse Network Status */}
        <div className="lg:col-span-6 bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-2xs">
          <h3 className="font-serif-display text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Regional Silo & Cold Storage Status</span>
            <Boxes className="w-4 h-4 text-emerald-800" />
          </h3>

          <div className="divide-y divide-slate-100">
            {regionalHubs.map((hub, idx) => (
              <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{hub.hub}</span>
                  <span className="text-[11px] text-slate-500">Capacity: {hub.capacity} | In Stock: <strong className="text-emerald-800">{hub.activeStock}</strong></span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {hub.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
