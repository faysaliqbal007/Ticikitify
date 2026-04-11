/**
 * api.ts — Central API client
 * All requests to the backend go through this file.
 * Automatically attaches the JWT token from localStorage.
 */



import type { Event as EventType } from '@/types';

const BASE_URL = 'http://localhost:5000/api';

// ─── Token helpers ─────────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('ticikitify_token');
export const setToken = (token: string) => localStorage.setItem('ticikitify_token', token);
export const removeToken = () => localStorage.removeItem('ticikitify_token');

// ─── Core fetch wrapper ────────────────────────────────────────────────────────
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only append application/json if sending a JSON string body
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Intercept 401 Unauthorized globally
    if (response.status === 401) {
      removeToken();
      window.dispatchEvent(new Event('ticikitify:auth:unauthorized'));
    }
    // Throw with the backend's error message
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data as T;
}

// ─── Auth endpoints ────────────────────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'customer' | 'organizer' | 'admin';
    avatar: string;
    createdAt: string;
  };
}

export const apiRegister = (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'customer' | 'organizer';
}) => request<{ message: string; requiresVerification: boolean; email: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) });

export const apiLogin = (data: { email: string; password: string; role: string }) =>
  request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) });

export const apiVerifyEmail = (token: string) =>
  request<AuthResponse & { message: string }>(`/auth/verify/${token}`);

export const apiResendVerification = (email: string) =>
  request<{ message: string }>('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) });

export const apiForgotPassword = (email: string) =>
  request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });

export const apiVerifyResetToken = (token: string) =>
  request<{ message: string }>(`/auth/verify-reset-token/${token}`);

export const apiResetPassword = (data: { token: string; newPassword: string }) =>
  request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) });

// ─── User endpoints ────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'organizer' | 'admin';
  avatar: string;
  createdAt: string;
}

export const apiGetMe = () => request<UserProfile>('/users/me');

export const apiGetAllUsers = () => request<UserProfile[]>('/users/all');

export const apiUpdateProfile = (data: FormData | { name?: string; phone?: string; avatar?: string }) => {
  const isFormData = data instanceof FormData;
  return request<UserProfile>('/users/me', { method: 'PUT', body: isFormData ? data : JSON.stringify(data) });
};

export const apiChangePassword = (data: { currentPassword: string; newPassword: string }) =>
  request<{ message: string }>('/users/me/password', { method: 'PUT', body: JSON.stringify(data) });

// ─── Events endpoints ──────────────────────────────────────────────────────────
export const apiGetEvents = (params?: { status?: string; organizer?: string }) => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return request<EventType[]>(`/events${query ? `?${query}` : ''}`);
};

export const apiGetAllEvents = () => request<EventType[]>('/events/all');
export const apiGetMyEvents = () => request<EventType[]>('/events/my');
export const apiGetEvent = (id: string) => request<EventType>(`/events/${id}`);

export const apiCreateEvent = (data: FormData | Partial<EventType>) => {
  const isFormData = data instanceof FormData;
  return request<EventType>('/events', { method: 'POST', body: isFormData ? data : JSON.stringify(data) });
};

export const apiUpdateEvent = (id: string, data: FormData | Partial<EventType>) => {
  const isFormData = data instanceof FormData;
  return request<EventType>(`/events/${id}`, { method: 'PUT', body: isFormData ? data : JSON.stringify(data) });
};

export const apiUpdateEventStatus = (id: string, status: string) =>
  request<EventType>(`/events/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });

export const apiToggleTrending = (id: string, isTrending: boolean) =>
  request<EventType>(`/events/${id}/trending`, { method: 'PUT', body: JSON.stringify({ isTrending }) });

export const apiDeleteEvent = (id: string) =>
  request<{ message: string }>(`/events/${id}`, { method: 'DELETE' });

// ─── Promo Codes endpoints ──────────────────────────────────────────────────
export const apiGetPromoCodes = () => request<any[]>('/promoCodes');

export const apiCreatePromoCode = (data: any) =>
  request<any>('/promoCodes', { method: 'POST', body: JSON.stringify(data) });

export const apiUpdatePromoCode = (id: string, data: any) =>
  request<any>(`/promoCodes/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const apiValidatePromoCode = (code: string, eventId: string) =>
  request<any>('/promoCodes/validate', { method: 'POST', body: JSON.stringify({ code, eventId }) });

export const apiDeletePromoCode = (id: string) =>
  request<{ message: string }>(`/promoCodes/${id}`, { method: 'DELETE' });

// ─── Tickets endpoints ──────────────────────────────────────────────────────────
export const apiInitTicketCheckout = (data: { eventId: string, ticketSelection: Record<string, number>, totalAmount: number, customerInfo: any, promoCodeId?: string }) =>
  request<{ GatewayPageURL: string }>('/tickets/init', { method: 'POST', body: JSON.stringify(data) });

export const apiGetMyTickets = () => request<any[]>('/tickets/my-tickets');
export const apiGetOrganizerStats = () => request<any>('/tickets/organizer-stats');
export const apiGetAdminStats = () => request<any>('/tickets/admin-stats');

// ─── Health check ─────────────────────────────────────────────────────────────
export const apiHealth = () => request<{ status: string }>('/health');
