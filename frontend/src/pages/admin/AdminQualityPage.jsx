import React, { useState, useEffect } from 'react';
import { 
  Microscope, CheckCircle2, AlertTriangle, XCircle, Plus, Search, 
  FileText, ShieldCheck, Scale, Thermometer, Award, ExternalLink 
} from 'lucide-react';
import api from '../../api/client';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { formatDate } from '../../utils/format';
import { toast } from 'sonner';

export const AdminQualityPage = () => {
  const [inspections, setInspections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [selectedProduct, setSelectedProduct] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [inspectorName, setInspectorName] = useState('Dr. S. K. Roy (Chief Agronomist)');
  const [moistureContent, setMoistureContent] = useState(12.2);
  const [brokenGrainPercentage, setBrokenGrainPercentage] = useState(0.8);
  const [foreignMatterPercentage, setForeignMatterPercentage] = useState(0.05);
  const [brixSweetness, setBrixSweetness] = useState(0);
  const [pesticideResidueFree, setPesticideResidueFree] = useState(true);
  const [zeroCarbideCertified, setZeroCarbideCertified] = useState(true);
  const [overallGrade, setOverallGrade] = useState('Grade A (Export Quality)');
  const [result, setResult] = useState('Approved');
  const [notes, setNotes] = useState('Passed Satake color sorter optical sorting with < 0.1% foreign matter.');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inspRes, prodRes] = await Promise.all([
        api.get('/quality'),
        api.get('/products?limit=50')
      ]);

      if (inspRes.success && inspRes.data) setInspections(inspRes.data);
      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data);
        if (prodRes.data.length > 0) setSelectedProduct(prodRes.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching quality inspections:', err);
      toast.error('Failed to load quality control records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    const generatedBatch = `BATCH-2026-${Date.now().toString().slice(-4)}`;
    setBatchNumber(generatedBatch);
    setMoistureContent(12.0);
    setBrokenGrainPercentage(0.5);
    setForeignMatterPercentage(0.04);
    setBrixSweetness(19.5);
    setPesticideResidueFree(true);
    setZeroCarbideCertified(true);
    setOverallGrade('Grade A (Export Quality)');
    setResult('Approved');
    setNotes('Verified compliant with BSTI BDS-1033 & Codex Alimentarius grain standards.');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        product: selectedProduct,
        batchNumber,
        inspectorName,
        metrics: {
          moistureContent: Number(moistureContent),
          brokenGrainPercentage: Number(brokenGrainPercentage),
          foreignMatterPercentage: Number(foreignMatterPercentage),
          brixSweetness: Number(brixSweetness),
          pesticideResidueFree: Boolean(pesticideResidueFree),
          zeroCarbideCertified: Boolean(zeroCarbideCertified)
        },
        overallGrade,
        result,
        notes
      };

      const res = await api.post('/quality', payload);
      if (res.success) {
        toast.success(`Batch inspection ${batchNumber} saved and certified!`);
        setModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to record inspection');
    } finally {
      setSaving(false);
    }
  };

  const filteredInspections = inspections.filter(ins => {
    const matchesStatus = statusFilter === 'all' || ins.result === statusFilter;
    const matchesSearch = !search || 
      ins.batchNumber?.toLowerCase().includes(search.toLowerCase()) ||
      ins.inspectorName?.toLowerCase().includes(search.toLowerCase()) ||
      ins.product?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const approvedCount = inspections.filter(i => i.result === 'Approved').length;
  const flaggedCount = inspections.filter(i => i.result === 'Flagged').length;
  const avgMoisture = inspections.length > 0 
    ? (inspections.reduce((s, i) => s + (i.metrics?.moistureContent || 0), 0) / inspections.length).toFixed(1)
    : '12.2';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold block mb-1 text-emerald-800">
            Agronomic Laboratory & Sortex Assurance
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900">
            Quality Inspection & Chemical Safety Certification
          </h1>
        </div>

        <Button variant="primary" size="md" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-1.5" /> Log Batch Lab Test
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-slate-500 block">Total Inspected Lots</span>
          <span className="font-serif-display text-2xl font-bold text-slate-900">{inspections.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Silo & Farm Lots Tested</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-emerald-800 block">Approved & Certified</span>
          <span className="font-serif-display text-2xl font-bold text-emerald-900">{approvedCount}</span>
          <span className="text-[11px] text-emerald-700 block mt-1">Cleared for Packaging</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-amber-800 block">Flagged For Review</span>
          <span className="font-serif-display text-2xl font-bold text-amber-900">{flaggedCount}</span>
          <span className="text-[11px] text-amber-700 block mt-1">Re-drying or Recleaning</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-slate-500 block">Mean Moisture Level</span>
          <span className="font-serif-display text-2xl font-bold text-slate-900">{avgMoisture}%</span>
          <span className="text-[11px] text-emerald-700 block mt-1">Standard: &lt;= 12.5%</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['all', 'Approved', 'Flagged', 'Rejected'].map(st => (
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
            placeholder="Search batch number, product, inspector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Inspections Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Batch Dossier</th>
              <th className="p-3.5">Commodity Product</th>
              <th className="p-3.5">Moisture & Metrics</th>
              <th className="p-3.5">Safety & Chemical</th>
              <th className="p-3.5">Grade</th>
              <th className="p-3.5">Outcome</th>
              <th className="p-3.5 text-right">Date Tested</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan="7" className="p-4"><Skeleton className="h-6 w-full" /></td>
                </tr>
              ))
            ) : filteredInspections.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500">
                  No quality inspections logged yet.
                </td>
              </tr>
            ) : (
              filteredInspections.map((ins) => (
                <tr key={ins._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono">
                    <span className="font-bold text-slate-900 block">{ins.batchNumber}</span>
                    <span className="text-[10px] text-slate-500">{ins.inspectorName}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 block">{ins.product?.name || 'Agricultural Lot'}</span>
                    <span className="text-[10px] text-emerald-800">{ins.product?.origin || 'Dinajpur Silo'}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="space-y-0.5">
                      <span className={`inline-block font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        (ins.metrics?.moistureContent || 0) <= 12.5 
                          ? 'bg-emerald-50 text-emerald-800' 
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        Moisture: {ins.metrics?.moistureContent || '--'}%
                      </span>
                      {ins.metrics?.brixSweetness > 0 && (
                        <span className="block text-[10px] text-amber-700 font-semibold">
                          Brix Sweetness: {ins.metrics.brixSweetness}°
                        </span>
                      )}
                      {ins.metrics?.brokenGrainPercentage !== undefined && (
                        <span className="block text-[10px] text-slate-500">
                          Broken: {ins.metrics.brokenGrainPercentage}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 text-[10px] text-emerald-800 font-medium">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Zero Carbide
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Pesticide Clean
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-800 text-[11px] block">
                      {ins.overallGrade || 'Grade A'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ins.result === 'Approved'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : ins.result === 'Flagged'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {ins.result === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                      {ins.result === 'Flagged' && <AlertTriangle className="w-3 h-3" />}
                      {ins.result === 'Rejected' && <XCircle className="w-3 h-3" />}
                      {ins.result}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono text-[11px] text-slate-500">
                    {formatDate(ins.createdAt || new Date())}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Log Inspection Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Laboratory Batch Quality Inspection"
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tested Agricultural Product *</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
                required
              >
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>

            <Input
              label="Batch Dossier Code *"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Accredited Agronomist / Inspector Name *"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              required
            />

            <Select
              label="Final Clearance Status *"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              options={[
                { value: 'Approved', label: 'Approved (Cleared for Packaging / Retail)' },
                { value: 'Flagged', label: 'Flagged (Requires Re-drying / Sortex Pass)' },
                { value: 'Rejected', label: 'Rejected (Non-compliant Batch)' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-4 rounded-xl border border-slate-200">
            <Input
              label="Moisture Content (%)"
              type="number"
              step="0.1"
              value={moistureContent}
              onChange={(e) => setMoistureContent(e.target.value)}
            />
            <Input
              label="Broken Grain (%)"
              type="number"
              step="0.1"
              value={brokenGrainPercentage}
              onChange={(e) => setBrokenGrainPercentage(e.target.value)}
            />
            <Input
              label="Foreign Matter (%)"
              type="number"
              step="0.01"
              value={foreignMatterPercentage}
              onChange={(e) => setForeignMatterPercentage(e.target.value)}
            />
            <Input
              label="Brix Sweetness (°)"
              type="number"
              step="0.1"
              value={brixSweetness}
              onChange={(e) => setBrixSweetness(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Overall Quality Classification Grade"
              value={overallGrade}
              onChange={(e) => setOverallGrade(e.target.value)}
              options={[
                { value: 'Grade A (Export Quality)', label: 'Grade A (Export Quality & Premium Retail)' },
                { value: 'Grade B (Standard Commercial)', label: 'Grade B (Standard Commercial Feeding/Milling)' },
                { value: 'Grade C (Secondary Processing)', label: 'Grade C (Secondary Processing)' }
              ]}
            />

            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={zeroCarbideCertified}
                  onChange={(e) => setZeroCarbideCertified(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                Zero Carbide Certified
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pesticideResidueFree}
                  onChange={(e) => setPesticideResidueFree(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                Pesticide Residue Safe
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Laboratory Remarks & Certifications</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Optical color sorter test completed. Conforms to BSTI specifications."
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={saving}>
              {saving ? 'Recording...' : 'Certify & Record Inspection'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
