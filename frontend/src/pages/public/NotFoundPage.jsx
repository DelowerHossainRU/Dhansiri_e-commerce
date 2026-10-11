import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PackageOpen } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <PackageOpen className="w-16 h-16 text-emerald-800 mx-auto mb-4 stroke-1" />
      <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
        Error 404
      </span>
      <h1 className="font-serif-display text-3xl font-bold text-slate-900 mb-2">
        Grain Batch or Page Not Found
      </h1>
      <p className="text-sm text-[#71717A] mb-8 font-light">
        The destination you are trying to visit has been moved or does not exist on the platform.
      </p>
      <Link to="/">
        <Button variant="primary" size="md">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Platform Home
        </Button>
      </Link>
    </div>
  );
};
