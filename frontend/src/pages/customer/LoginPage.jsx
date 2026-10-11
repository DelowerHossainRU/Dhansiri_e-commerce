import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { toast } from 'sonner';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      if (['Admin', 'Super Admin'].includes(user.role)) {
        navigate('/admin');
      } else if (user.role === 'Wholesale Customer') {
        navigate('/wholesale/dashboard');
      } else {
        navigate(from);
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 p-8 rounded-xs shadow-xs space-y-6">
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
            Access Account
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900">
            Sign In to Dhansiri Agro
          </h1>
          <p className="text-xs text-[#71717A] mt-1 font-light">
            Manage your personal grain orders, delivery addresses, and saved wishlists.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            required
          />

          <Input
            label="Password *"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" loading={submitting}>
            Sign In to Portal <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Quick Demo Credentials Bar */}
        <div className="pt-4 border-t border-slate-200 text-xs">
          <p className="font-bold text-slate-900 mb-2 text-[11px] uppercase tracking-wider text-center text-[#71717A]">
            Quick Demo Credentials:
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@dhansiriagro.com', 'AdminPassword2026!')}
              className="p-1.5 bg-slate-50 border border-slate-200 hover:border-slate-700 rounded-xs font-semibold text-[11px]"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('customer@dhansiriagro.com', 'Customer2026!')}
              className="p-1.5 bg-slate-50 border border-slate-200 hover:border-slate-700 rounded-xs font-semibold text-[11px]"
            >
              Retail Buyer
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('b2b@dhansiriagro.com', 'Wholesale2026!')}
              className="p-1.5 bg-slate-50 border border-slate-200 hover:border-slate-700 rounded-xs font-semibold text-[11px]"
            >
              B2B Merchant
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#71717A] pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-slate-900 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
