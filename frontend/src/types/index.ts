export type ListingType = 'rent' | 'buy';

export type PropertyType =
  | 'Apartment'
  | 'Villa'
  | 'Independent House'
  | 'Builder Floor'
  | 'Studio'
  | 'Penthouse'
  | 'Plot'
  | 'Land'
  | 'Commercial';

export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';

export type PropertyAge =
  | 'Under Construction'
  | 'Ready to Move (0-1 yr)'
  | '1-5 years'
  | '5-10 years'
  | '10+ years';

export type OwnerType = 'Owner' | 'Builder' | 'Agent';

export interface Property {
  id: string;
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  priceUnit: 'month' | 'total';
  maintenanceCharges?: number;
  depositAmount?: number;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  carpetAreaSqFt: number;
  superBuiltUpAreaSqFt: number;
  pricePerSqFt?: number;
  furnishing: FurnishingStatus;
  facing: string;
  floorNo: number;
  totalFloors: number;
  ageOfProperty: PropertyAge;
  availableFrom: string;
  address: string;
  locality: string;
  city: string;
  pinCode: string;
  landmark?: string;
  societyName?: string;
  images: string[];
  amenities: string[];
  isVerified: boolean;
  isZeroBrokerage: boolean;
  gatedSecurity: boolean;
  petFriendly: boolean;
  preferredTenants?: string[];
  viewsCount: number;
  shortlistedCount: number;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerType: OwnerType;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: number;
  propertyListingType: ListingType;
  ownerId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message: string;
  visitDate?: string;
  visitTimeSlot?: string;
  userType: 'Buyer' | 'Tenant' | 'Investor';
  status: 'Pending' | 'Contacted' | 'Visit Scheduled' | 'Closed';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'agent' | 'builder';
  avatar?: string;
  savedProperties: string[];
  createdAt: string;
}

export interface FilterParams {
  search?: string;
  city?: string;
  locality?: string;
  listingType?: ListingType | 'all';
  propertyTypes?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number[];
  furnishing?: FurnishingStatus[];
  isVerified?: boolean;
  isZeroBrokerage?: boolean;
  readyToMove?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'area_desc' | 'popular';
  cursor?: string;
  limit?: number;
  page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    nextCursor: string | null;
    limit: number;
  };
}

export interface AuthResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}
