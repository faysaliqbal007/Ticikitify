import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Event, PromoCode, Order } from '@/types';
import { useEvents } from './EventsContext';
import { useAuth } from './AuthContext';
import { apiGetPromoCodes, apiCreatePromoCode, apiUpdatePromoCode as updatePromoApi, apiDeletePromoCode } from '@/lib/api';

interface OrganizerContextType {
  events: Event[];
  orders: Order[];
  addEvent: (event: Omit<Event, 'id' | 'ticketsRemaining' | 'organizer'> | FormData) => Promise<Event>;
  updateEvent: (id: string, updates: Partial<Event> | FormData) => Promise<void>;
  deleteEvent: (id: string) => void;
  duplicateEvent: (id: string) => void;
  updateEventStatus: (id: string, status: Event['status']) => void;
  toggleTrending: (id: string, isTrending: boolean) => Promise<void>;
  promoCodes: PromoCode[];
  addPromoCode: (data: Omit<PromoCode, 'id' | 'usageCount'>) => Promise<void>;
  updatePromoCode: (id: string, updates: Partial<PromoCode>) => Promise<void>;
  deletePromoCode: (id: string) => Promise<void>;
}

export const OrganizerContext = createContext<OrganizerContextType | undefined>(undefined);

// Fallback constant removed to enforce isolation
// const DEFAULT_ORGANIZER_ID = 'org1';

export function OrganizerProvider({ children }: { children: ReactNode }) {
  const { events: allEvents, addEvent: addGlobalEvent, updateEvent: updateGlobalEvent, updateEventStatus: updateGlobalEventStatus, toggleTrending: updateGlobalTrending, deleteEvent: deleteGlobalEvent } = useEvents();
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

  // Fetch PromoCodes
  useMemo(() => {
    if (user && (user.role === 'organizer' || user.role === 'admin')) {
      apiGetPromoCodes().then((res) => {
        // Map backend _id to frontend id if needed, or assume backend returns _id which we assign to id
        const mapped = res.map((r: any) => ({ ...r, id: r._id || r.id }));
        setPromoCodes(mapped);
      }).catch(console.error);
    }
  }, [user]);

  const addEvent = async (data: Omit<Event, 'id' | 'ticketsRemaining' | 'organizer'> | FormData): Promise<Event> => {
    let payload = data;
    if (!(data instanceof FormData)) {
      payload = {
        ...data,
        status: data.status || (user?.role === 'admin' ? 'approved' : 'pending'),
      };
    }
    const newEvent = await addGlobalEvent(payload);
    return newEvent;
  };

  const updateEvent = async (id: string, updates: Partial<Event> | FormData) => {
    const event = allEvents.find(e => e.id === id);
    if (!event) return;

    if (event.organizer.id !== organizerId && user?.role !== 'admin') {
      console.warn("Unauthorized update attempt");
      return;
    }
    await updateGlobalEvent(id, updates);
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

  const toggleTrending = async (id: string, isTrending: boolean) => {
    if (user?.role !== 'admin') return;
    try {
      await updateGlobalTrending(id, isTrending);
    } catch (err) {
      console.error('Failed to update trending status', err);
      throw err; // Re-throw to handle it in UI (e.g., max 4 limit)
    }
  };

  const addPromoCode = async (data: Omit<PromoCode, 'id' | 'usageCount'>) => {
    try {
      const newPromo = await apiCreatePromoCode(data);
      const mapped = { ...newPromo, id: newPromo._id || newPromo.id };
      setPromoCodes((prev) => [mapped, ...prev]);
    } catch(e) {
      console.error(e);
      throw e;
    }
  };

  const updatePromoCode = async (id: string, updates: Partial<PromoCode>) => {
    try {
      const updated = await updatePromoApi(id, updates);
      const mapped = { ...updated, id: updated._id || updated.id };
      setPromoCodes((prev) => prev.map((p) => (p.id === id ? mapped : p)));
    } catch(e) {
      console.error(e);
      throw e;
    }
  };

  const deletePromoCode = async (id: string) => {
    try {
      await apiDeletePromoCode(id);
      setPromoCodes((prev) => prev.filter(p => p.id !== id));
    } catch(e) {
      console.error(e);
      throw e;
    }
  };

  const orders = useMemo((): Order[] => {
    // Orders now come from the API (organizer-stats / admin-stats endpoints)
    return [];
  }, []);

  const value = useMemo(
    () => ({
      events,
      orders,
      addEvent,
      updateEvent,
      deleteEvent,
      duplicateEvent,
      updateEventStatus,
      toggleTrending,
      promoCodes,
      addPromoCode,
      updatePromoCode,
      deletePromoCode,
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
