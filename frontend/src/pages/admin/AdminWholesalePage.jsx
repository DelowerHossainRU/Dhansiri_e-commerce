import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle2, XCircle, Clock, ShieldCheck, Scale } from 'lucide-react';
import api from '../../api/client';
import { formatPrice, formatDate } from '../../utils/format';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Skeleton } from '../../components/common/Skeleton';
import { toast } from 'sonner';

export const AdminWholesalePage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('Approved');
  const [pricingTier, setPricingTier] = useState('wholesale');
  const [creditLimit, setCreditLimit] = useState(500000);
  const [paymentTermsDays, setPaymentTermsDays] = useState(15);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wholesale/applications');
      if (res.success && res.data) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const openReviewModal = (app) => {
    setSelectedApp(app);
    setReviewStatus(app.status === 'Pending' ? 'Approved' : app.status);
    setPricingTier(app.assignedPricingTier || 'wholesale');
    setCreditLimit(app.approvedCreditLimit || 500000);
    setPaymentTermsDays(app.paymentTermsDays || 15);
    setAdminRemarks(app.adminRemarks || 'Trade license verified with DNCC registrar.');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.put(`/wholesale/applications/${selectedApp._id}/review`, {
        status: reviewStatus,
        assignedPricingTier: pricingTier,
        creditLimit: Number(creditLimit),
        paymentTermsDays: Number(paymentTermsDays),
        adminRemarks
      });

      if (res.success) {
        toast.success(`Application marked as ${reviewStatus}!`);
        setSelectedApp(null);
        fetchApps();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to review application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs uppercase tracking-widest font-bold block mb-1 text-emerald-800">
          B2B Underwriting
        </span>
        <h1 className="font-serif-display text-2xl font-bold text-slate-900">
          Wholesale & Institutional Account Applications
        </h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-xs overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Company / Applicant</th>
              <th className="p-3.5">Business Sector</th>
              <th className="p-3.5">Trade License</th>
              <th className="p-3.5">Monthly Est.</th>
              <th className="p-3.5">District</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="p-4"><Skeleton className="h-6 w-full" /></td></tr>
              ))
            ) : applications.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">No wholesale applications pending.</td></tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 block">{app.companyName}</span>
                    <span className="text-[11px] text-slate-500">{app.applicantName} • {app.phone}</span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-800">{app.businessType}</td>
                  <td className="p-3.5 font-mono text-slate-500">{app.tradeLicenseNumber}</td>
                  <td className="p-3.5 font-bold text-slate-900">{app.estimatedMonthlyTon} MT / Month</td>
                  <td className="p-3.5 text-slate-500">{app.district}</td>
                  <td className="p-3.5"><StatusBadge status={app.status} /></td>
                  <td className="p-3.5">
                    <button
                      onClick={() => openReviewModal(app)}
                      className="px-2.5 py-1 text-white rounded-xs font-semibold hover:opacity-90 text-[11px] shadow-xs"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      Underwrite
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Review Application: ${selectedApp.companyName}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs text-xs space-y-1">
              <div><span className="font-semibold text-slate-600">Applicant:</span> {selectedApp.applicantName} ({selectedApp.phone})</div>
              <div><span className="font-semibold text-slate-600">Trade License:</span> <span className="font-mono">{selectedApp.tradeLicenseNumber}</span></div>
              <div><span className="font-semibold text-slate-600">Address:</span> {selectedApp.address}, {selectedApp.district}</div>
              <div><span className="font-semibold text-slate-600">Monthly Volume:</span> {selectedApp.estimatedMonthlyTon} Metric Tons</div>
            </div>

            <Select
              label="Application Decision *"
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value)}
            >
              <option value="Approved">Approved (Grant B2B Privileges)</option>
              <option value="Under Review">Under Review (Hold for Document Verification)</option>
              <option value="Rejected">Rejected</option>
            </Select>

            {reviewStatus === 'Approved' && (
              <div className="space-y-3 pt-2">
                <Select
                  label="Assigned Pricing Tier *"
                  value={pricingTier}
                  onChange={(e) => setPricingTier(e.target.value)}
                >
                  <option value="wholesale">Wholesale Tier (Standard Bulk)</option>
                  <option value="distributor">Distributor Tier (Deep Dealer Margins)</option>
                  <option value="corporate">Corporate / Institutional Rate</option>
                </Select>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Approved Credit Limit (BDT) *"
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    required
                  />
                  <Input
                    label="Payment Terms (Days) *"
                    type="number"
                    value={paymentTermsDays}
                    onChange={(e) => setPaymentTermsDays(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <Input
              label="Underwriter Internal Remarks"
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="ghost" size="md" onClick={() => setSelectedApp(null)}>Cancel</Button>
              <Button type="submit" variant="primary" size="md" loading={submitting}>
                Save Decision & Notify Merchant
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
