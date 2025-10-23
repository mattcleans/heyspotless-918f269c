
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: Date;
  status: string | null;
  is_read?: boolean | null;
  updated_at?: string | null;
}

export interface Contact {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastSeen?: Date;
  type: 'client' | 'employee';
  role?: string;
}

interface MessagesState {
  messages: Message[];
  contacts: Contact[];
  selectedContact: Contact | null;
  filter: 'all' | 'client' | 'employee';
  fetchMessages: () => Promise<void>;
  addMessage: (message: { content: string; receiver_id: string }) => Promise<void>;
  setSelectedContact: (contact: Contact | null) => void;
  setFilter: (filter: 'all' | 'client' | 'employee') => void;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: [],
  contacts: [],
  selectedContact: null,
  filter: 'all',

  fetchMessages: async () => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        toast.error("Couldn't load messages. Please try again.");
        throw error;
      }

      const { data: contacts, error: contactsError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, user_type');

      if (contactsError) {
        toast.error("Couldn't load contacts. Please try again.");
        throw contactsError;
      }

      // Transform contacts data
      const formattedContacts: Contact[] = contacts
        .filter(contact => contact.first_name && contact.last_name) // Only include contacts with names
        .map(contact => ({
          id: contact.id,
          name: `${contact.first_name} ${contact.last_name}`,
          status: 'online', // You might want to implement real presence tracking
          type: contact.user_type === 'staff' ? 'employee' : 'client',
          role: contact.user_type === 'staff' ? 'Cleaning Specialist' : undefined
        }));

      set({ 
        messages: messages.map(msg => ({
          ...msg,
          created_at: new Date(msg.created_at)
        })),
        contacts: formattedContacts
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },

  addMessage: async ({ content, receiver_id }) => {
    try {
      const { data: userResponse } = await supabase.auth.getUser();
      if (!userResponse?.user) {
        throw new Error('No authenticated user found');
      }

      const { data, error } = await supabase
        .from('messages')
        .insert({
          content,
          receiver_id,
          sender_id: userResponse.user.id,
          status: 'unread'
        })
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        messages: [...state.messages, { ...data, created_at: new Date(data.created_at) }]
      }));

      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Couldn't send message. Please try again.");
    }
  },

  setSelectedContact: (contact) => set({ selectedContact: contact }),
  setFilter: (filter) => set({ filter }),
}));

// Set up real-time updates
supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'messages'
    },
    async (payload) => {
      // Refresh messages when there's a change
      const store = useMessagesStore.getState();
      await store.fetchMessages();
    }
  )
  .subscribe();
