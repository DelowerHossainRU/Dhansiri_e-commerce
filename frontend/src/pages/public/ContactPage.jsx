import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck } from 'lucide-react';
import api from '../../api/client';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { toast } from 'sonner';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [inquiryType, setInquiryType] = useState('General');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post('/cms/contact', {
        name,
        email,
        phone,
        subject,
        inquiryType,
        message
      });
      if (res.success) {
        toast.success('Your message has been received! Our customer desk will respond promptly.');
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
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
            Communications Desk
          </span>
          <h1
            className="font-serif-display text-4xl sm:text-5xl font-bold leading-tight"
            style={{ color: 'var(--brand-primary)' }}
          >
            Connect with Dhansiri Agro
          </h1>
          <p className="text-base text-[#52525B] font-light leading-relaxed">
            Whether inquiring about household grain deliveries, institutional hospitality supply, or scheduled mill facility visits, our team is at your disposal.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xs space-y-4">
              <h3 className="font-serif-display text-lg font-bold text-slate-900">Corporate Head Office</h3>
              <div className="space-y-3 text-xs text-[#52525B]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span>Level 7, Concord Tower, Road 11, Block D, Banani, Dhaka-1213, Bangladesh</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>+880 1711-000000 / +880 2-9887766</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>corporate@dhansiriagro.com</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xs space-y-4">
              <h3 className="font-serif-display text-lg font-bold text-slate-900">Milling Complex & Central Silos</h3>
              <div className="space-y-3 text-xs text-[#52525B]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span>Plots 12–16, Pulhat Industrial Area, Dinajpur Sadar, Dinajpur-5200</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>+880 1722-111111 (Trade Desk)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>Silo Intake: Saturday – Thursday, 7:00 AM – 9:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-xs shadow-xs">
            <h2 className="font-serif-display text-xl font-bold text-slate-900 mb-1">Send a Message</h2>
            <p className="text-xs text-[#71717A] mb-6">Our response team will review and reply within 4 business hours.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number *"
                  placeholder="01711223344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Input
                  label="Email Address *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Select
                  label="Inquiry Category *"
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                >
                  <option value="General">General Inquiry</option>
                  <option value="Retail Order">Retail Delivery Question</option>
                  <option value="Bulk Supply & Export">Bulk Institutional & Export</option>
                  <option value="Distributorship">Distributorship Franchise</option>
                  <option value="Press & Media">Press & Agricultural Research</option>
                </Select>
              </div>

              <Input
                label="Subject *"
                placeholder="e.g. Inquiring regarding 50 MT Chinigura supply"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A4744] mb-1.5">
                  Your Message / Specifications *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please state details regarding your requirement..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xs text-xs outline-none focus:border-emerald-700"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" loading={submitting}>
                <Send className="w-4 h-4 mr-1.5" /> Submit Communications Inquiries
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
