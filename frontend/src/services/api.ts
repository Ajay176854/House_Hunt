import { Property, Inquiry, User, FilterParams, PaginatedResponse, AuthResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
const TOKEN_KEY = 'househunt_jwt_token';
const REFRESH_TOKEN_KEY = 'househunt_refresh_token';

// =================== Token Management ===================

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {}
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch {}
}

// =================== HTTP Client ===================

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set application/json if not sending FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error?.message || data.error || data.message || `Request failed with status ${response.status}`;
    const error: any = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

// =================== Properties API ===================

export interface MetadataResponse {
  success: boolean;
  cities: string[];
  cityCounts: Record<string, number>;
  heroProperty: Property | null;
  stats: {
    totalProperties: number;
    rentProperties: number;
    buyProperties: number;
  };
}

export async function getMetadata(): Promise<MetadataResponse> {
  return request<MetadataResponse>('/api/listings/metadata');
}

export async function getProperties(params: FilterParams = {}): Promise<PaginatedResponse<Property>> {
  const query = new URLSearchParams();

  if (params.search) query.append('search', params.search);
  if (params.city && params.city !== 'all') query.append('city', params.city);
  if (params.locality && params.locality !== 'all') query.append('locality', params.locality);
  if (params.listingType && params.listingType !== 'all') query.append('listingType', params.listingType);
  if (params.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
  if (params.isVerified) query.append('isVerified', 'true');
  if (params.isZeroBrokerage) query.append('isZeroBrokerage', 'true');
  if (params.sort) query.append('sort', params.sort);
  if (params.cursor) query.append('cursor', params.cursor);
  if (params.limit) query.append('limit', params.limit.toString());

  if (params.propertyTypes && params.propertyTypes.length > 0) {
    params.propertyTypes.forEach((pt) => query.append('propertyTypes', pt));
  }

  if (params.bedrooms && params.bedrooms.length > 0) {
    params.bedrooms.forEach((b) => query.append('bedrooms', b.toString()));
  }

  if (params.furnishing && params.furnishing.length > 0) {
    params.furnishing.forEach((f) => query.append('furnishing', f));
  }

  return request<PaginatedResponse<Property>>(`/api/listings?${query.toString()}`);
}

export async function getPropertyById(id: string): Promise<{ property: Property; similar: Property[] }> {
  return request<{ property: Property; similar: Property[] }>(`/api/listings/${id}`);
}

export async function createProperty(data: FormData | Partial<Property>): Promise<{ success: boolean; property: Property; message: string }> {
  return request<{ success: boolean; property: Property; message: string }>('/api/listings', {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
}

export async function updateProperty(id: string, data: FormData | Partial<Property>): Promise<{ success: boolean; property: Property }> {
  return request<{ success: boolean; property: Property }>(`/api/listings/${id}`, {
    method: 'PUT',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
}

export async function deleteProperty(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/listings/${id}`, {
    method: 'DELETE',
  });
}

export async function getMyListings(): Promise<{ data: Property[]; total: number }> {
  return request<{ data: Property[]; total: number }>('/api/listings/user/my-listings');
}

export async function togglePropertyShortlist(id: string): Promise<{ savedProperties: string[]; isSaved: boolean; shortlistedCount: number }> {
  return request<{ savedProperties: string[]; isSaved: boolean; shortlistedCount: number }>(`/api/listings/${id}/shortlist`, {
    method: 'POST',
  });
}

// =================== Inquiries API ===================

export async function sendInquiry(inquiryData: {
  propertyId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message?: string;
  visitDate?: string;
  visitTimeSlot?: string;
  userType?: 'Buyer' | 'Tenant' | 'Investor';
}): Promise<{ message: string; inquiry: Inquiry; ownerContact: { name: string; phone: string; email: string } }> {
  return request<{ message: string; inquiry: Inquiry; ownerContact: { name: string; phone: string; email: string } }>('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify(inquiryData),
  });
}

export async function getMyInquiries(): Promise<{ data: Inquiry[]; total: number }> {
  return request<{ data: Inquiry[]; total: number }>('/api/inquiries/my');
}

export async function updateInquiryStatus(id: string, status: string): Promise<{ message: string; inquiry: Inquiry }> {
  return request<{ message: string; inquiry: Inquiry }>(`/api/inquiries/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// =================== Auth API ===================

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
}): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  setAuthToken(data.token || data.accessToken);
  if (data.refreshToken) setRefreshToken(data.refreshToken);
  return data;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.token || data.accessToken);
  if (data.refreshToken) setRefreshToken(data.refreshToken);
  return data;
}

export async function refreshAccessToken(): Promise<AuthResponse> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const data = await request<AuthResponse>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  setAuthToken(data.token || data.accessToken);
  if (data.refreshToken) setRefreshToken(data.refreshToken);
  return data;
}

export async function logoutUser(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    await request('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // Ignore logout errors
  }
  removeAuthToken();
}

export async function getMe(): Promise<{ user: User }> {
  return request<{ user: User }>('/api/auth/me');
}
