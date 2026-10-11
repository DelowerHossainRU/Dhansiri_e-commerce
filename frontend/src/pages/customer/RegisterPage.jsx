import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { toast } from 'sonner';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setSubmitting(true);
      const user = await register({ name, email, phone, password });
      toast.success(`Account registered! Welcome to Dhansiri Agro, ${user.name}`);
      navigate('/account');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 p-8 rounded-xs shadow-xs space-y-6">
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
            Create Profile
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900">
            Register as a Retail Buyer
          </h1>
          <p className="text-xs text-[#71717A] mt-1 font-light">
            Enjoy rapid checkout, saved addresses, personal wishlists, and seasonal grain notifications.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tanvir Ahmed"
            required
          />

          <Input
            label="Phone Number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 01711223344"
            required
          />

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

          <Input
            label="Confirm Password *"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" loading={submitting}>
            Create Customer Account <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="text-center text-xs text-[#71717A] pt-2">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-slate-900 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
