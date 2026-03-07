export interface Organizer {
  id: string;
  name: string;
  logo?: string;
  description: string;
  eventsCount: number;
  rating: number;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  role: string;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  quantity: number;
  available: number;
  description: string;
  benefits?: string[];
  saleStartDate?: string;
  saleEndDate?: string;
  earlyBirdPrice?: number;
  earlyBirdEndDate?: string;
}

export interface Seat {
  id: string;
  row: string;
  number: string;
  tierId: string;
  status: 'available' | 'held' | 'sold';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'concerts' | 'sports' | 'tech' | 'cultural' | 'theater' | 'food';
  image: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  originalPrice?: number;
  ticketsRemaining: number;
  isFeatured: boolean;
  isTrending: boolean;
  organizer: Organizer;
  artists?: Artist[];
  ticketTiers: TicketTier[];
  shortDescription?: string;
  fullDescription?: string;
  googleMapsLink?: string;
  status?: 'draft' | 'live' | 'sold_out' | 'cancelled' | 'completed' | 'scheduled' | 'pending' | 'approved' | 'rejected';
  publishAt?: string;
  isSeatBased?: boolean;
  seats?: Seat[];
  rules?: {
    ageRestriction?: string;
    entryPolicy?: string;
    refundPolicy?: string;
    dressCode?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'organizer' | 'admin';
}

export interface Ticket {
  id: string;
  eventId: string;
  event: Event;
  tier: TicketTier;
  qrCode: string;
  status: 'valid' | 'used' | 'refunded';
  seatNumber?: string;
  purchaseDate: string;
  checkedInAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  event: Event;
  tickets: Ticket[];
  totalAmount: number;
  serviceFee: number;
  vat: number;
  discount: number;
  finalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  createdAt: string;
}

export interface FilterOptions {
  category?: string;
  city?: string;
  dateRange?: { from: Date; to: Date };
  priceRange?: { min: number; max: number };
  searchQuery?: string;
}

export interface DashboardStats {
  totalTicketsSold: number;
  totalRevenue: number;
  upcomingEvents: number;
  pageViews: number;
}

export interface SalesData {
  date: string;
  sales: number;
  revenue: number;
}

export interface Transaction {
  id: string;
  date: string;
  eventName: string;
  amount: number;
  commission: number;
  netAmount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending';
}

export interface Wallet {
  balance: number;
  pendingAmount: number;
  withdrawnAmount: number;
  transactions: Transaction[];
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: string;
  usageLimit?: number;
  usageCount: number;
  minimumOrderAmount?: number;
  isActive: boolean;
}

export interface OrganizerApplication {
  id: string;
  businessName: string;
  tradeLicenseNumber: string;
  tinNumber: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branch: string;
  };
  kycStatus: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}
