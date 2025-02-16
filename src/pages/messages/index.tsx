
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Phone, Video, History, Search } from "lucide-react";
import { useMessagesStore, type Contact, type Message } from "@/services/messages";
import { format } from "date-fns";

const MessagesPage = () => {
  const { contacts, messages, selectedContact, setSelectedContact, addMessage } = useMessagesStore();
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get messages for selected contact
  const contactMessages = messages.filter(
    (message) =>
      (message.senderId === selectedContact?.id && message.receiverId === 'currentUser') ||
      (message.senderId === 'currentUser' && message.receiverId === selectedContact?.id)
  );

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [contactMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;

    addMessage({
      content: messageInput,
      senderId: 'currentUser',
      receiverId: selectedContact.id,
    });
    setMessageInput("");
  };

  const formatMessageTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  return (
    <div className="h-[calc(100vh-5rem)] p-6">
      <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Contacts List */}
        <Card className="md:col-span-1 h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id
                      ? "bg-[#0066B3] text-white"
                      : "hover:bg-[#A8E6EF]/10"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{contact.name}</p>
                    <span className={`h-2 w-2 rounded-full ${
                      contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <p className="text-sm mt-1 opacity-70">
                    {contact.status === 'offline' && contact.lastSeen
                      ? `Last seen ${format(contact.lastSeen, 'h:mm a')}`
                      : contact.status}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-3 h-full flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-[#1B365D]">
                    {selectedContact.name}
                  </h2>
                  <p className="text-sm text-[#1B365D]/60">
                    {selectedContact.status === 'online' ? 'Online' : 
                      selectedContact.lastSeen ? `Last seen ${format(selectedContact.lastSeen, 'h:mm a')}` : 'Offline'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <History className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {contactMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 items-start ${
                        message.senderId === 'currentUser' ? 'justify-end' : ''
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg max-w-[80%] ${
                          message.senderId === 'currentUser'
                            ? 'bg-[#0066B3] text-white'
                            : 'bg-[#0066B3]/10 text-[#1B365D]'
                        }`}
                      >
                        <p>{message.content}</p>
                        <span className={`text-xs mt-1 block ${
                          message.senderId === 'currentUser' ? 'text-white/60' : 'text-[#1B365D]/60'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    className="flex-1"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    className="bg-[#0066B3]"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-[#1B365D]/60">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
