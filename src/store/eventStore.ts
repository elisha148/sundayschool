import { create } from 'zustand';
import { Event } from '../types';
import { EventsAPI } from '../services/api';

interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  loadEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<Event | null>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getUpcomingEvents: () => Event[];
  getEventsByDate: (date: string) => Event[];
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  isLoading: true,
  error: null,

  loadEvents: async () => {
    try {
      set({ isLoading: true, error: null });
      const events = await EventsAPI.getAll();
      const mapped = events.map((e: any) => ({ ...e, id: e._id || e.id }));
      set({ events: mapped, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addEvent: async (eventData) => {
    try {
      const newEvent = await EventsAPI.create(eventData);
      const mapped = { ...newEvent, id: newEvent._id || newEvent.id };
      set({ events: [...get().events, mapped] });
      return mapped;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateEvent: async (id, updates) => {
    try {
      const updated = await EventsAPI.update(id, updates);
      const mapped = { ...updated, id: updated._id || updated.id };
      set({ events: get().events.map(e => e.id === id ? mapped : e) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteEvent: async (id) => {
    try {
      await EventsAPI.delete(id);
      set({ events: get().events.filter(e => e.id !== id) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  getUpcomingEvents: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().events
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  getEventsByDate: (date) => {
    return get().events.filter(e => e.date === date);
  },
}));
