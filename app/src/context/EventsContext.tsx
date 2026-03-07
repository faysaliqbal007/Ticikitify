import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Event as EventType } from '@/types';
import {
  apiGetEvents,
  apiCreateEvent,
  apiUpdateEvent,
  apiUpdateEventStatus,
  apiDeleteEvent,
} from '@/lib/api';

interface EventsContextType {
  events: EventType[];
  fetchEvents: () => Promise<void>;
  addEvent: (event: Partial<EventType>) => Promise<EventType>;
  updateEvent: (id: string, updates: Partial<EventType>) => Promise<EventType>;
  updateEventStatus: (id: string, status: string) => Promise<EventType>;
  deleteEvent: (id: string) => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventType[]>([]);

  const fetchEvents = async () => {
    try {
      const data = await apiGetEvents();
      // Safe cast to EventType explicitly assuming api handles this cleanly
      setEvents(data as unknown as EventType[]);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (eventData: Partial<EventType>) => {
    const newEvent = await apiCreateEvent(eventData) as unknown as EventType;
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = async (id: string, updates: Partial<EventType>) => {
    const updated = await apiUpdateEvent(id, updates) as unknown as EventType;
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const updateEventStatus = async (id: string, status: string) => {
    const updated = await apiUpdateEventStatus(id, status) as unknown as EventType;
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const deleteEvent = async (id: string) => {
    await apiDeleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const value = useMemo(
    () => ({
      events,
      fetchEvents,
      addEvent,
      updateEvent,
      updateEventStatus,
      deleteEvent,
    }),
    [events]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return ctx;
}
