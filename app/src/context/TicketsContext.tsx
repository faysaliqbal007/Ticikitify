import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Ticket, Event } from '@/types';
import { myTickets as seedTickets } from '@/data/mockData';
import { useAuth } from './AuthContext';
import { useEvents } from './EventsContext';

interface TicketsContextType {
  tickets: Ticket[];
  addTickets: (event: Event, tickets: { [tierId: string]: number }) => void;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

const STORAGE_KEY = 'user_tickets';

export function TicketsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { events } = useEvents();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Load tickets from localStorage on mount and resolve event references
  useEffect(() => {
    if (user && user.role !== 'organizer') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && events.length > 0) {
          const parsedTickets: Ticket[] = JSON.parse(stored);
          // Resolve event references from EventsContext
          const resolvedTickets = parsedTickets.map(ticket => {
            const event = events.find(e => e.id === ticket.eventId);
            if (event) {
              return {
                ...ticket,
                event: event,
                tier: event.ticketTiers.find(t => t.id === ticket.tier.id) || ticket.tier,
              };
            }
            return ticket;
          }).filter(ticket => ticket.event); // Remove tickets for events that no longer exist
          setTickets(resolvedTickets);
        } else if (!stored) {
          // Initialize with seed tickets for demo
          setTickets(seedTickets);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTickets));
        }
      } catch (error) {
        console.error('Failed to load tickets', error);
        setTickets(seedTickets);
      }
    } else {
      setTickets([]);
    }
  }, [user, events]);

  // Save tickets to localStorage whenever they change
  useEffect(() => {
    if (user && user.role !== 'organizer' && tickets.length >= 0) {
      try {
        // Remove duplicates based on ticket ID before saving
        const uniqueTickets = Array.from(
          new Map(tickets.map(ticket => [ticket.id, ticket])).values()
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueTickets));
        // Update state if duplicates were removed
        if (uniqueTickets.length !== tickets.length) {
          setTickets(uniqueTickets);
        }
      } catch (error) {
        console.error('Failed to save tickets', error);
      }
    }
  }, [tickets, user]);

  const addTickets = (event: Event, ticketSelections: { [tierId: string]: number }) => {
    const newTickets: Ticket[] = [];
    const purchaseDate = new Date().toISOString();
    const baseTimestamp = Date.now();
    let ticketIndex = 0;

    event.ticketTiers.forEach((tier) => {
      const quantity = ticketSelections[tier.id] || 0;
      if (quantity > 0 && quantity <= 100) { // Limit to prevent invalid quantities
        for (let i = 0; i < quantity; i++) {
          // Generate unique ticket ID with timestamp, index, and random component
          const uniqueId = `${baseTimestamp}-${ticketIndex}-${Math.random().toString(36).substr(2, 9)}`;
          const ticketId = `ticket-${uniqueId}`;
          const eventPrefix = event.id.length >= 4 ? event.id.substring(0, 4).toUpperCase() : event.id.toUpperCase().padEnd(4, 'X');
          const tierPrefix = tier.name.substring(0, 3).toUpperCase().padEnd(3, 'X');
          const qrCode = `TICIKIFY-${eventPrefix}-${uniqueId.substring(7, 15).toUpperCase()}-${tierPrefix}`;

          newTickets.push({
            id: ticketId,
            eventId: event.id,
            event: event,
            tier: tier,
            qrCode: qrCode,
            status: 'valid',
            seatNumber: event.isSeatBased && event.seats
              ? event.seats[ticketIndex]?.number || undefined
              : undefined,
            purchaseDate: purchaseDate,
          });
          ticketIndex++;
        }
      }
    });

    if (newTickets.length > 0) {
      setTickets((prev) => {
        // Prevent duplicates by checking existing ticket IDs
        const existingIds = new Set(prev.map(t => t.id));
        const uniqueNewTickets = newTickets.filter(t => !existingIds.has(t.id));
        return [...uniqueNewTickets, ...prev];
      });
    }
  };

  return (
    <TicketsContext.Provider value={{ tickets, addTickets }}>
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const ctx = useContext(TicketsContext);
  if (!ctx) {
    throw new Error('useTickets must be used within a TicketsProvider');
  }
  return ctx;
}
