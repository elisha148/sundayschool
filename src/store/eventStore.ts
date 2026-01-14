import { create } from 'zustand';
import { Event } from '../types';
import { StorageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

interface EventState {
  events: Event[];
  isLoading: boolean;
  loadEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<Event>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getUpcomingEvents: () => Event[];
  getEventsByDate: (date: string) => Event[];
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  isLoading: true,

  loadEvents: async () => {
    const events = await StorageService.get<Event[]>(STORAGE_KEYS.EVENTS);
    set({ events: events || [], isLoading: false });
  },

  addEvent: async (eventData) => {
    const newEvent: Event = {
      ...eventData,
      id: generateId(),
    };
    const { events } = get();
    const updated = [...events, newEvent];
    await StorageService.set(STORAGE_KEYS.EVENTS, updated);
    set({ events: updated });
    return newEvent;
  },

  updateEvent: async (id, updates) => {
    const { events } = get();
    const updated = events.map(e => e.id === id ? { ...e, ...updates } : e);
    await StorageService.set(STORAGE_KEYS.EVENTS, updated);
    set({ events: updated });
  },

  deleteEvent: async (id) => {
    const { events } = get();
    const updated = events.filter(e => e.id !== id);
    await StorageService.set(STORAGE_KEYS.EVENTS, updated);
    set({ events: updated });
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
