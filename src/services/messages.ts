
import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: Date;
}

interface MessagesState {
  messages: Message[];
  contacts: Contact[];
  selectedContact: Contact | null;
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => void;
  setSelectedContact: (contact: Contact | null) => void;
}

// Mock data
const mockContacts: Contact[] = [
  { id: '1', name: 'John Smith', status: 'online' },
  { id: '2', name: 'Maria Garcia', status: 'offline', lastSeen: new Date() },
  { id: '3', name: 'David Wilson', status: 'online' },
  { id: '4', name: 'Sarah Johnson', status: 'offline', lastSeen: new Date() },
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    senderId: '1',
    receiverId: 'currentUser',
    timestamp: new Date(Date.now() - 3600000),
    status: 'read',
  },
  {
    id: '2',
    content: 'I need to reschedule my cleaning for next week.',
    senderId: 'currentUser',
    receiverId: '1',
    timestamp: new Date(Date.now() - 3500000),
    status: 'delivered',
  },
];

export const useMessagesStore = create<MessagesState>((set) => ({
  messages: mockMessages,
  contacts: mockContacts,
  selectedContact: null,
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          status: 'sent',
        },
      ],
    })),
  setSelectedContact: (contact) => set({ selectedContact: contact }),
}));
