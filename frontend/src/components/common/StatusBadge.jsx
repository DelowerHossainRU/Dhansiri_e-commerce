import React from 'react';
import { Badge } from './Badge';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  if (['delivered', 'paid', 'approved', 'active', 'resolved', 'received'].includes(normalized)) {
    return <Badge variant="success">{status}</Badge>;
  }

  if (['processing', 'confirmed', 'packed', 'shipped', 'out for delivery', 'under review', 'in progress', 'contacted', 'qualified'].includes(normalized)) {
    return <Badge variant="info">{status}</Badge>;
  }

  if (['pending', 'unpaid', 'new', 'draft', 'sent'].includes(normalized)) {
    return <Badge variant="warning">{status}</Badge>;
  }

  if (['cancelled', 'rejected', 'failed', 'suspended', 'lost'].includes(normalized)) {
    return <Badge variant="danger">{status}</Badge>;
  }

  return <Badge variant="neutral">{status}</Badge>;
};
