
import { useState } from "react";
import { useMessagesStore, type Contact } from "@/services/messages";
import { useAuthStore } from "@/App";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GuestChat } from "./components/GuestChat";
import { ContactsList } from "./components/ContactsList";
import { ChatArea } from "./components/ChatArea";

const MessagesPage = () => {
  const { contacts, messages, selectedContact, setSelectedContact, addMessage, filter, setFilter } = useMessagesStore();
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuthStore();

  // Create a default HQ contact for non-authenticated users
  const hqContact: Contact = {
    id: 'hq',
    name: 'Hey Spotless HQ',
    status: 'online',
    type: 'employee',
    role: 'Customer Support'
  };

  // Set HQ as selected contact for non-authenticated users
  if (!isAuthenticated && !selectedContact) {
    setSelectedContact(hqContact);
  }

  // Filter contacts based on search query and type
  const filteredContacts = isAuthenticated 
    ? contacts.filter((contact) => {
        const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || contact.type === filter;
        return matchesSearch && matchesFilter;
      })
    : [hqContact];

  // Get messages for selected contact
  const contactMessages = messages.filter(
    (message) =>
      (message.senderId === selectedContact?.id && message.receiverId === 'currentUser') ||
      (message.senderId === 'currentUser' && message.receiverId === selectedContact?.id)
  );

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage = {
      id: Math.random().toString(),
      content: messageInput,
      senderId: 'currentUser',
      receiverId: selectedContact.id,
      timestamp: new Date(),
      status: 'sent' as const
    };

    // Add message to local state
    addMessage(newMessage);

    // If user is not authenticated and sending to HQ, store in Supabase
    if (!isAuthenticated && selectedContact.id === 'hq') {
      try {
        const { error } = await supabase
          .from('support_messages')
          .insert({
            content: messageInput,
            sender_type: 'guest',
            status: 'unread'
          } as any);

        if (error) throw error;
        toast.success("Message sent successfully!");
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error("Couldn't send message. Please try again.");
      }
    }

    setMessageInput("");
  };

  // For non-authenticated users, only show the chat area
  if (!isAuthenticated) {
    return (
      <GuestChat
        messages={contactMessages}
        messageInput={messageInput}
        onMessageChange={setMessageInput}
        onSendMessage={handleSendMessage}
      />
    );
  }

  // Return authenticated user interface
  return (
    <div className="h-[calc(100vh-5rem)] p-6">
      <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-6">
        <ContactsList
          contacts={filteredContacts}
          selectedContact={selectedContact}
          searchQuery={searchQuery}
          filter={filter}
          onContactSelect={setSelectedContact}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilter}
        />
        {selectedContact ? (
          <ChatArea
            selectedContact={selectedContact}
            messages={contactMessages}
            messageInput={messageInput}
            onMessageChange={setMessageInput}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="md:col-span-3 h-full flex items-center justify-center">
            <div className="text-center text-[#1B365D]/60">
              Select a conversation to start messaging
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
