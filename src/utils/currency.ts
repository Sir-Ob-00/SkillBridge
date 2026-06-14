export const formatCurrency = (
  amount: number,
  currency: string = 'GHS'
): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatPriceRange = (from: number, to?: number): string => {
  if (!to || to === from) return `From ${formatCurrency(from)}`;
  return `${formatCurrency(from)} - ${formatCurrency(to)}`;
};
