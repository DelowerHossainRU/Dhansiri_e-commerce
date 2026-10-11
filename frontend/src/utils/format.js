export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '৳0';
  return `৳${Number(amount).toLocaleString('en-BD')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatWeight = (kg) => {
  if (!kg) return '0 kg';
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} Ton`;
  }
  return `${kg} kg`;
};
