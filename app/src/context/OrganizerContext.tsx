import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Event, PromoCode, Organizer, Order } from '@/types';
import { orders as seedOrders } from '@/data/mockData';
import { useEvents } from './EventsContext';
import { useAuth } from './AuthContext';

interface OrganizerContextType {
  events: Event[];
  orders: Order[];
  addEvent: (event: Omit<Event, 'id' | 'ticketsRemaining' | 'organizer'>) => Event;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  duplicateEvent: (id: string) => void;
  updateEventStatus: (id: string, status: Event['status']) => void;
  promoCodes: PromoCode[];
  addPromoCode: (data: Omit<PromoCode, 'id' | 'usageCount'>) => void;
  updatePromoCode: (id: string, updates: Partial<PromoCode>) => void;
}

export const OrganizerContext = createContext<OrganizerContextType | undefined>(undefined);

// Fallback constant removed to enforce isolation
// const DEFAULT_ORGANIZER_ID = 'org1';

export function OrganizerProvider({ children }: { children: ReactNode }) {
  const { events: allEvents, addEvent: addGlobalEvent, updateEvent: updateGlobalEvent, updateEventStatus: updateGlobalEventStatus, deleteEvent: deleteGlobalEvent } = useEvents();
  const { user } = useAuth();

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);

  // Identify current organizer ID - STRICT ISOLATION
  // Only use user.id if logged in. Never default to 'org1'.
  const organizerId = (user?.role === 'organizer' || user?.role === 'admin') ? user.id : '';

  // Filter events: Admin sees all (or should admin utilize OrganizerContext? Probably not, but if so, let's play safe)
  // For Organizer: sees only their own.
  const events = useMemo(() => {
    if (!user || !organizerId) return [];

    // Admin sees all events
    if (user.role === 'admin') return allEvents;

    // Filter events where organizer.id matches current user.
    return allEvents.filter(e => e.organizer && e.organizer.id === organizerId);
  }, [allEvents, organizerId, user]);

  const addEvent = (data: Omit<Event, 'id' | 'ticketsRemaining' | 'organizer'>): Event => {
    const totalQuantity = data.ticketTiers.reduce((sum, tier) => sum + (tier.quantity || 0), 0);

    // Construct Organizer object from User + defaults
    const organizerProfile: Organizer = {
      id: organizerId,
      name: user?.name || 'Organizer',
      description: 'Event Organizer',
      eventsCount: allEvents.filter(e => e.organizer && e.organizer.id === organizerId).length + 1,
      rating: 5.0, // New organizers get 5?
      logo: user?.avatar
    };

    const newEvent: Event = {
      ...data,
      id: `org-${Date.now()}`,
      organizer: organizerProfile,
      ticketsRemaining: totalQuantity,
      // Use provided status or fallback. Organizer events default to pending if not specified.
      status: data.status || (user?.role === 'admin' ? 'approved' : 'pending'),
    };

    addGlobalEvent(newEvent);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    // Logic: check ownership
    const event = allEvents.find(e => e.id === id);
    if (!event) return;

    if (event.organizer.id !== organizerId && user?.role !== 'admin') {
      console.warn("Unauthorized update attempt");
      return;
    }
    updateGlobalEvent(id, updates);
  };

  const deleteEvent = (id: string) => {
    const event = allEvents.find(e => e.id === id);
    if (!event) return;

    if (event.organizer.id !== organizerId && user?.role !== 'admin') {
      console.warn("Unauthorized delete attempt");
      return;
    }
    deleteGlobalEvent(id);
  };

  const duplicateEvent = (id: string) => {
    const original = allEvents.find((e) => e.id === id);
    if (!original) return;

    // Ensure ownership
    if (original.organizer.id !== organizerId && user?.role !== 'admin') return;

    const copy: Event = {
      ...original,
      id: `copy-${Date.now()}`,
      title: `${original.title} (Copy)`,
      status: 'draft', // Draft by default
    };
    addGlobalEvent(copy);
  };

  const updateEventStatus = async (id: string, status: Event['status']) => {
    if (!status) return;
    try {
      await updateGlobalEventStatus(id, status);
    } catch (err) {
      console.error('Failed to update event status', err);
    }
  };

  const addPromoCode = (data: Omit<PromoCode, 'id' | 'usageCount'>) => {
    setPromoCodes((prev) => [
      {
        ...data,
        id: `pc-${Date.now()}`,
        usageCount: 0,
      },
      ...prev,
    ]);
  };

  const updatePromoCode = (id: string, updates: Partial<PromoCode>) => {
    setPromoCodes((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const orders = useMemo(() => {
    if (!user || user.role === 'customer') return [];
    if (user.role === 'admin') return seedOrders;
    // Strict filtering by organizer ID
    return seedOrders.filter(o => o.event && o.event.organizer && o.event.organizer.id === organizerId);
  }, [organizerId, user]);

  const value = useMemo(
    () => ({
      events,
      orders,
      addEvent,
      updateEvent,
      deleteEvent,
      duplicateEvent,
      updateEventStatus,
      promoCodes,
      addPromoCode,
      updatePromoCode,
    }),
    [events, orders, promoCodes, organizerId, user, allEvents]
  );

  return <OrganizerContext.Provider value={value}>{children}</OrganizerContext.Provider>;
}

export function useOrganizer() {
  const ctx = useContext(OrganizerContext);
  if (!ctx) {
    throw new Error('useOrganizer must be used within an OrganizerProvider');
  }
  return ctx;
}

// export const organizerOrders = [];
