
import { useState } from "react";
import { useMessagesStore, type Contact } from "@/services/messages";
import { useAuthStore } from "@/stores/auth";
import GuestChat from "./components/GuestChat";
import ContactsList from "./components/ContactsList";
import ChatArea from "./components/ChatArea";

const MessagesPage = () => {
  const { contacts, messages, selectedContact, setSelectedContact, addMessage, fetchMessages, filter, setFilter } = useMessagesStore();
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, userId, userType } = useAuthStore();

  // Create a default HQ contact for all users
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

  // Filter contacts based on search query, type, and user role
  const filteredContacts = isAuthenticated 
    ? contacts.filter((contact) => {
        const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || contact.type === filter;
        
        // For non-staff users, only show employees
        if (userType !== 'staff') {
          return matchesSearch && contact.type === 'employee';
        }
        
        return matchesSearch && matchesFilter;
      })
    : [hqContact];

  // Get messages for selected contact
  const contactMessages = messages.filter(
    (message) =>
      (message.sender_id === selectedContact?.id && message.receiver_id === userId) ||
      (message.sender_id === userId && message.receiver_id === selectedContact?.id)
  );

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedContact) return;
    await addMessage({
      content: messageInput,
      receiver_id: selectedContact.id
    });
    setMessageInput("");
  };

  // For non-authenticated users, only show the guest chat
  if (!isAuthenticated) {
    return <GuestChat />;
  }

  // Return original messages interface for authenticated users
  return (
    <div className="h-[calc(100vh-5rem)] p-6">
      <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-6">
        <ContactsList
          contacts={filteredContacts}
          selectedContact={selectedContact}
          onContactSelect={setSelectedContact}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
          showFilters={userType === 'staff'}
        />
        <ChatArea
          selectedContact={selectedContact}
          messages={contactMessages}
          messageInput={messageInput}
          onMessageInputChange={setMessageInput}
          onSendMessage={handleSendMessage}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default MessagesPage;
