import React, { useState } from 'react';
import { Building2, ShieldCheck, Truck, Users, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import api from '../../api/client';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { toast } from 'sonner';

export const DistributorPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [assignedTerritory, setAssignedTerritory] = useState('');
  const [address, setAddress] = useState('');
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState('');
  const [outletsCount, setOutletsCount] = useState(25);
  const [monthlyTons, setMonthlyTons] = useState(10);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post('/wholesale/distributor-apply', {
        companyName,
        ownerName,
        phone,
        email,
        district,
        assignedTerritory: assignedTerritory || `${district} Regional Territory`,
        address,
        tradeLicenseNumber,
        existingDistributionOutletsCount: Number(outletsCount),
        monthlyOrderCommitmentTons: Number(monthlyTons),
        notes
      });

      if (res.success) {
        toast.success('Distributor franchise application submitted! Our national sales manager will get in touch.');
        setCompanyName('');
        setOwnerName('');
        setPhone('');
        setAddress('');
        setTradeLicenseNumber('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section
        className="py-16 sm:py-20 border-b transition-colors duration-200"
        style={{
          backgroundColor: 'var(--brand-subtle)',
          borderColor: 'var(--brand-border)'
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span
            className="text-xs uppercase tracking-widest font-bold block"
            style={{ color: 'var(--brand-accent)' }}
          >
            National Distribution Network
          </span>
          <h1
            className="font-serif-display text-4xl sm:text-5xl font-bold leading-tight"
            style={{ color: 'var(--brand-primary)' }}
          >
            Become an Authorized Dhansiri Distributor
          </h1>
          <p className="text-base text-[#52525B] font-light leading-relaxed">
            Partner with an established grain brand. We grant territorial exclusivity, competitive dealer margins, dedicated logistics trucks, and localized POS marketing materials.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-xs shadow-xs">
            <h2 className="font-serif-display text-xl font-bold text-slate-900 mb-2">
              Distributor Franchise Application
            </h2>
            <p className="text-xs text-[#71717A] mb-6">
              Complete the profile below. Applicants must hold a valid Trade License and have existing FMCG retail connections.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Distributor Enterprise Name *"
                  placeholder="e.g. M/S Bismillah Traders & Grain"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <Input
                  label="Proprietor / Managing Partner Name *"
                  placeholder="e.g. Haji Nurul Islam"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
                <Input
                  label="Contact Phone Number *"
                  placeholder="e.g. 01711223344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Input
                  label="Business Email *"
                  type="email"
                  placeholder="distributor@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="District & Town *"
                  placeholder="e.g. Bogura Sadar"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
                <Input
                  label="Desired Exclusive Territory *"
                  placeholder="e.g. Greater Bogura & Joypurhat"
                  value={assignedTerritory}
                  onChange={(e) => setAssignedTerritory(e.target.value)}
                />
                <Input
                  label="Trade License Number *"
                  placeholder="e.g. TRAD-BOG-98214"
                  value={tradeLicenseNumber}
                  onChange={(e) => setTradeLicenseNumber(e.target.value)}
                  required
                />
                <Input
                  label="Retail Grocery Outlets Covered *"
                  type="number"
                  min="5"
                  value={outletsCount}
                  onChange={(e) => setOutletsCount(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Input
                  label="Warehouse / Godown Address *"
                  placeholder="Full physical street address of your depot"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <Input
                  label="Monthly Order Commitment (Metric Tons) *"
                  type="number"
                  min="5"
                  value={monthlyTons}
                  onChange={(e) => setMonthlyTons(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A4744] mb-1.5">
                  Remarks / Existing FMCG Brands Represented
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detail your fleet capacity (e.g. 2 pickups, 1 truck) and current retail coverage..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xs text-xs outline-none focus:border-emerald-700"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-4" loading={submitting}>
                Submit Distributorship Application <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>

          {/* Benefits */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xs space-y-4">
              <h3 className="font-serif-display text-lg font-bold text-slate-900">
                Distributor Benefits & Support
              </h3>
              <div className="space-y-3 text-xs text-[#52525B]">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Protected Territory Rights</span>
                    Exclusive distribution territory without competing secondary dealers in your designated upazila or district.
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Direct Factory Freight</span>
                    Consignments shipped directly from Dinajpur mill silo to your godown on full truckload rates.
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Retail Merchandising Support</span>
                    Banners, dealer signboards, sample pouches, and promotional flyers provided free of cost.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
