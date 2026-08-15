import { ListingType } from '../types';

export function formatIndianPrice(price: number, listingType: ListingType = 'rent'): string {
  if (!price || isNaN(price)) return '₹0';

  if (listingType === 'rent') {
    return `₹${price.toLocaleString('en-IN')}/mo`;
  }

  // Buy price in Lakhs / Crores
  if (price >= 10000000) {
    const crores = price / 10000000;
    return `₹${crores.toFixed(crores % 1 === 0 ? 0 : 2)} Cr`;
  } else if (price >= 100000) {
    const lakhs = price / 100000;
    return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 2)} Lac`;
  }

  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatArea(sqft: number): string {
  if (!sqft) return '0 sq.ft.';
  return `${sqft.toLocaleString('en-IN')} sq.ft.`;
}

export function formatIndianNumber(num: number): string {
  return (num || 0).toLocaleString('en-IN');
}

export function timeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recently';
  }
}
