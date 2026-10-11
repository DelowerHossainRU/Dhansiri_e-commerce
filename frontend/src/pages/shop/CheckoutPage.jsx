import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight, Truck, CreditCard, Banknote, Building2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import api from '../../api/client';
import { toast } from 'sonner';

export const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Form state
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [customerNotes, setCustomerNotes] = useState('');

  // Pre-fill user default address if exists
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setRecipientName(defaultAddr.recipientName || user.name);
      setPhone(defaultAddr.phone || user.phone);
      setDivision(defaultAddr.division || 'Dhaka');
      setDistrict(defaultAddr.district || 'Dhaka');
      setUpazila(defaultAddr.upazila || '');
      setStreetAddress(defaultAddr.streetAddress || '');
      setPostalCode(defaultAddr.postalCode || '');
    }
  }, [user]);

  if (!cart.items || cart.items.length === 0) {
    if (createdOrder) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
            Order Registration Complete
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-slate-900 mb-2">
            Thank You for Sourcing with Dhansiri
          </h1>
          <p className="text-sm text-[#52525B] max-w-md mx-auto mb-6">
            Your commercial rice requisition has been received and allocated. An invoice has been generated.
          </p>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xs text-left max-w-md mx-auto mb-8 space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-[#71717A]">Order Number:</span> <span className="font-bold text-slate-900">{createdOrder.orderNumber}</span></div>
            <div className="flex justify-between"><span className="text-[#71717A]">Invoice Number:</span> <span className="font-bold text-slate-900">{createdOrder.invoiceNumber}</span></div>
            <div className="flex justify-between"><span className="text-[#71717A]">Total Amount:</span> <span className="font-bold text-slate-900">{formatPrice(createdOrder.grandTotal)}</span></div>
            <div className="flex justify-between"><span className="text-[#71717A]">Payment Mode:</span> <span className="font-bold text-slate-900">{createdOrder.paymentMethod}</span></div>
            <div className="flex justify-between"><span className="text-[#71717A]">Dispatch Hub:</span> <span className="font-bold text-[#1E382B]">Tejgaon Central Silo</span></div>
          </div>

          <div className="flex justify-center gap-4">
            <Link to={`/track/${createdOrder.orderNumber}`}>
              <Button variant="primary">Track Order Status</Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 text-emerald-800 mx-auto mb-4 stroke-1" />
        <h2 className="font-serif-display text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-[#71717A] mb-6">Please select packaged rice cultivars before proceeding to checkout.</p>
        <Link to="/shop">
          <Button variant="primary">Browse Rice Catalog</Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!recipientName || !phone || !streetAddress || !district) {
      toast.error('Please complete all mandatory delivery fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/orders', {
        items: cart.items.map(i => ({
          productId: i.product._id || i.product,
          variantSku: i.variantSku,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        })),
        shippingAddress: {
          recipientName,
          phone,
          division,
          district,
          upazila,
          streetAddress,
          postalCode
        },
        paymentMethod,
        couponCode: cart.appliedCoupon?.code,
        customerNotes
      });

      if (res.success && res.data) {
        setCreatedOrder(res.data);
        clearCart();
        toast.success(`Order #${res.data.orderNumber} successfully confirmed!`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const bangladeshDistricts = [
    'Dhaka', 'Gazipur', 'Narayanganj', 'Chittagong', 'Cox\'s Bazar', 'Sylhet', 'Moulvibazar',
    'Rajshahi', 'Dinajpur', 'Bogura', 'Naogaon', 'Rangpur', 'Khulna', 'Jessore', 'Kushtia',
    'Barishal', 'Patuakhali', 'Mymensingh', 'Comilla', 'Noakhali', 'Feni', 'Brahmanbaria'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-slate-200 mb-8">
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
          Secure Grain Checkout
        </span>
        <h1 className="font-serif-display text-3xl font-semibold text-slate-900">
          Complete Your Order
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Delivery Address */}
          <div className="bg-white border border-slate-200 p-6 rounded-xs">
            <h3 className="font-serif-display text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
              <span>1. Delivery Destination</span>
              <Truck className="w-4 h-4 text-emerald-800" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Recipient Full Name *"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />
              <Input
                label="Contact Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 01711223344"
                required
              />
              <div className="sm:col-span-2">
                <Input
                  label="Email (For Invoice Copy)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
              </div>
              <Select
                label="District *"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                {bangladeshDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
              <Input
                label="Thana / Upazila"
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                placeholder="e.g. Banani, Dhanmondi, Uttara"
              />
              <div className="sm:col-span-2">
                <Input
                  label="Street Address / House / Road / Area *"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. House 24, Road 11, Block D"
                  required
                />
              </div>
              <Input
                label="Postal Code (Optional)"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="1213"
              />
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white border border-slate-200 p-6 rounded-xs">
            <h3 className="font-serif-display text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
              <span>2. Payment Option</span>
              <CreditCard className="w-4 h-4 text-emerald-800" />
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: 'Cash on Delivery',
                  title: 'Cash on Delivery (COD)',
                  desc: 'Pay physical cash to courier personnel upon inspecting sealed grain sacks at your doorstep.',
                  icon: Banknote
                },
                {
                  id: 'bKash',
                  title: 'bKash Merchant Payment',
                  desc: 'Instant digital settlement via bKash merchant gateway.',
                  icon: CreditCard
                },
                {
                  id: 'Nagad',
                  title: 'Nagad Payment',
                  desc: 'Post Office digital wallet payment.',
                  icon: CreditCard
                },
                {
                  id: 'Bank Transfer',
                  title: 'Bank Wire / Institutional Cheque',
                  desc: 'Direct account transfer to Dhansiri Agro Industries Ltd. (Prime Bank & City Bank). Ideal for bulk sacks.',
                  icon: Building2
                }
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <label
                    key={m.id}
                    className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-800 bg-slate-50 ring-1 ring-[#121316]'
                        : 'border-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.id}
                        checked={isSelected}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-emerald-800" />
                          <span className="text-xs font-bold text-slate-900">{m.title}</span>
                        </div>
                        <p className="text-[11px] text-[#71717A] mt-1 font-light leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="bg-white border border-slate-200 p-6 rounded-xs">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A4744] mb-2">
              Delivery Notes & Elevator / Security Instructions
            </label>
            <textarea
              rows={2}
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="e.g. Please call 15 minutes before arrival, leave at security desk..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xs text-xs outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        {/* Right Summary Box */}
        <div className="lg:col-span-5">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xs sticky top-28 space-y-6">
            <h3 className="font-serif-display text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Order Summary ({cart.items.length} Varieties)
            </h3>

            {/* Items review */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 divide-y divide-[#EFE9DF]">
              {cart.items.map((i) => (
                <div key={i._id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 line-clamp-1">{i.variantTitle}</span>
                    <span className="text-[11px] text-[#71717A]">
                      {i.quantity} × {formatPrice(i.unitPrice)} ({i.weightKg * i.quantity} kg total)
                    </span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatPrice(i.quantity * i.unitPrice)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs pt-4 border-t border-slate-200">
              <div className="flex justify-between text-[#52525B]">
                <span>Grain Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(cart.subtotal)}</span>
              </div>
              {cart.appliedCoupon && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon ({cart.appliedCoupon.code})</span>
                  <span>-{formatPrice(cart.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#52525B]">
                <span>Delivery Charge ({district.toLowerCase().includes('dhaka') ? 'Inside Dhaka' : 'District Express'})</span>
                <span className="font-semibold text-slate-900">
                  {cart.deliveryCharge === 0 ? 'Complimentary Free' : formatPrice(cart.deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Payable</span>
                <span className="text-[#1E382B]">{formatPrice(cart.grandTotal)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-4"
              loading={submitting}
              onClick={handlePlaceOrder}
            >
              Confirm Order Registration <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#71717A] text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official VAT/Tax Commercial Invoice will be issued</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
