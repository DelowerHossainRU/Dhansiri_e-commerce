import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, MapPin, User, Lock, Heart, LifeBuoy, Clock, 
  ArrowRight, Plus, Trash2, CheckCircle2, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import api from '../../api/client';
import { formatPrice, formatDate } from '../../utils/format';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Skeleton } from '../../components/common/Skeleton';
import { toast } from 'sonner';

export const AccountDashboardPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'profile' | 'support'
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDistrict, setNewDistrict] = useState('Dhaka');
  const [newAddress, setNewAddress] = useState('');

  // Support ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Order Issue');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await api.get('/orders/my-orders');
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchTickets = async () => {
      try {
        const res = await api.get('/cms/tickets/my');
        if (res.success && res.data) {
          setTickets(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
    fetchTickets();
  }, [user, navigate]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/address', {
        title: 'Alternate Destination',
        recipientName: newRecipient,
        phone: newPhone,
        division: 'Dhaka',
        district: newDistrict,
        streetAddress: newAddress
      });
      if (res.success) {
        toast.success('New delivery address added');
        setShowAddressModal(false);
        setNewRecipient('');
        setNewPhone('');
        setNewAddress('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add address');
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      setSubmittingTicket(true);
      const res = await api.post('/cms/tickets', {
        subject: ticketSubject,
        category: ticketCategory,
        message: ticketMessage
      });
      if (res.success) {
        toast.success('Support ticket created. Our team will review shortly.');
        setTicketSubject('');
        setTicketMessage('');
        const ticketRes = await api.get('/cms/tickets/my');
        if (ticketRes.success) setTickets(ticketRes.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create ticket');
    } finally {
      setSubmittingTicket(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-slate-200 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
            Customer Account Portal
          </span>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-slate-900">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Member Role: <span className="font-semibold text-slate-900">{user.role}</span> • Pricing Tier: <span className="uppercase text-emerald-800 font-bold">{user.pricingTier}</span>
          </p>
        </div>

        <button
          onClick={logout}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2 lg:sticky lg:top-24 lg:self-start">
          {[
            { id: 'orders', label: 'Order History', icon: ShoppingBag, count: orders.length },
            { id: 'addresses', label: 'Delivery Addresses', icon: MapPin, count: user.addresses?.length || 0 },
            { id: 'support', label: 'Customer Helpdesk', icon: LifeBuoy, count: tickets.length },
            { id: 'profile', label: 'Profile Settings', icon: User }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xs text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 border-l-2 border-[#166534] shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-800' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-emerald-200/60 text-emerald-900' : 'bg-slate-100 text-slate-500'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          <Link
            to="/account/wishlist"
            className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xs text-xs font-semibold text-[#52525B] hover:border-slate-700"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>Saved Grains</span>
            </div>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-50 text-[#71717A]">
              {wishlistCount}
            </span>
          </Link>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 bg-white border border-slate-200 p-6 sm:p-8 rounded-xs shadow-xs min-h-[400px]">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <h3 className="font-serif-display text-lg font-bold text-slate-900">
                  Past Purchases & Consignments
                </h3>
                <span className="text-xs text-[#71717A]">All shipments include official invoice</span>
              </div>

              {loadingOrders ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-sm text-[#71717A]">
                  No orders recorded yet. Explore our freshly milled harvest varieties.
                  <div className="mt-4">
                    <Link to="/shop"><Button variant="primary" size="sm">Explore Rice Catalog</Button></Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord._id} className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
                        <div>
                          <span className="font-serif-display font-bold text-sm text-slate-900">{ord.orderNumber}</span>
                          <span className="text-[11px] text-[#71717A] ml-2">({formatDate(ord.createdAt)})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={ord.orderStatus} />
                          <StatusBadge status={ord.paymentStatus} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        {ord.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-[#52525B]">
                            <span>{item.quantity} × {item.variantTitle}</span>
                            <span className="font-semibold text-slate-900">{formatPrice(item.totalPrice)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold">
                        <span>Total Paid ({ord.paymentMethod})</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-900">{formatPrice(ord.grandTotal)}</span>
                          <Link to={`/track/${ord.orderNumber}`}>
                            <Button variant="outline" size="sm" className="text-[10px] py-1 px-2.5">
                              Track
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <h3 className="font-serif-display text-lg font-bold text-slate-900">
                  Registered Delivery Addresses
                </h3>
                <Button variant="outline" size="sm" onClick={() => setShowAddressModal(!showAddressModal)}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Address
                </Button>
              </div>

              {showAddressModal && (
                <form onSubmit={handleAddAddress} className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-3 mb-6">
                  <h4 className="font-bold text-xs text-slate-900">New Delivery Location</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Recipient *" value={newRecipient} onChange={(e) => setNewRecipient(e.target.value)} required />
                    <Input label="Phone *" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
                    <Input label="District *" value={newDistrict} onChange={(e) => setNewDistrict(e.target.value)} required />
                    <Input label="Street Address *" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} required />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowAddressModal(false)}>Cancel</Button>
                    <Button type="submit" variant="primary" size="sm">Save Address</Button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses?.map((addr) => (
                  <div key={addr._id} className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-1 text-xs relative">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{addr.title}</span>
                      {addr.isDefault && <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-xs">Default</span>}
                    </div>
                    <p className="text-[#52525B] font-semibold">{addr.recipientName} ({addr.phone})</p>
                    <p className="text-[#71717A] leading-snug">{addr.streetAddress}, {addr.upazila || ''}, {addr.district}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUPPORT TICKETS */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <h3 className="font-serif-display text-lg font-bold text-slate-900">
                  Customer Service Helpdesk
                </h3>
              </div>

              {/* Submit Ticket */}
              <form onSubmit={handleCreateTicket} className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-3">
                <h4 className="font-bold text-xs text-slate-900">Open a Support or Moisture Inquiry</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Subject *"
                    placeholder="e.g. Inquiring regarding delivery schedule"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    required
                  />
                  <Select
                    label="Category *"
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                  >
                    <option value="Order Issue">Order Issue</option>
                    <option value="Delivery Delay">Delivery Delay</option>
                    <option value="Product Quality / Moisture Query">Grain Quality / Moisture Query</option>
                    <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#4A4744] mb-1">Message *</label>
                  <textarea
                    rows={2}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="State your question..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xs text-xs outline-none focus:border-emerald-700"
                  />
                </div>
                <Button type="submit" variant="primary" size="sm" loading={submittingTicket}>
                  Submit Ticket
                </Button>
              </form>

              {/* Tickets list */}
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t._id} className="p-4 bg-white border border-slate-200 rounded-xs space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-emerald-800">{t.ticketNumber}</span>
                      <StatusBadge status={t.status} />
                    </div>
                    <h5 className="font-bold text-sm text-slate-900">{t.subject}</h5>
                    <p className="text-[#52525B] font-light">{t.messages?.[0]?.message}</p>
                    <span className="text-[11px] text-[#71717A] block pt-1">{formatDate(t.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-lg">
              <h3 className="font-serif-display text-lg font-bold text-slate-900 pb-3 border-b border-slate-200">
                Personal & Commercial Profile
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[#71717A] uppercase font-semibold block mb-1">Registered Name</span>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs font-bold text-slate-900">{user.name}</div>
                </div>
                <div>
                  <span className="text-[#71717A] uppercase font-semibold block mb-1">Primary Email</span>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs font-bold text-slate-900">{user.email}</div>
                </div>
                <div>
                  <span className="text-[#71717A] uppercase font-semibold block mb-1">Contact Phone</span>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs font-bold text-slate-900">{user.phone}</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
