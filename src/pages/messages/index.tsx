
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Phone, Video, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MessagesPage = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const contacts = [
    { id: "1", name: "John Smith", lastMessage: "See you tomorrow at 10 AM", time: "2m ago" },
    { id: "2", name: "Maria Garcia", lastMessage: "Thanks for the update", time: "1h ago" },
    { id: "3", name: "David Wilson", lastMessage: "The cleaning was great!", time: "3h ago" },
  ];

  return (
    <div className="h-[calc(100vh-5rem)] p-6">
      <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Contacts List */}
        <Card className="md:col-span-1 h-full flex flex-col">
          <div className="p-4 border-b">
            <Input placeholder="Search contacts..." className="w-full" />
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedContact === contact.id
                      ? "bg-[#0066B3] text-white"
                      : "hover:bg-[#A8E6EF]/10"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{contact.name}</p>
                    <span className="text-xs opacity-70">{contact.time}</span>
                  </div>
                  <p className="text-sm mt-1 opacity-70">{contact.lastMessage}</p>
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
                    {contacts.find((c) => c.id === selectedContact)?.name}
                  </h2>
                  <p className="text-sm text-[#1B365D]/60">Online</p>
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
                  {/* Example Messages */}
                  <div className="flex gap-2 items-start">
                    <div className="bg-[#0066B3]/10 p-3 rounded-lg max-w-[80%]">
                      <p className="text-[#1B365D]">Hello! How can I help you today?</p>
                      <span className="text-xs text-[#1B365D]/60 mt-1">9:41 AM</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start justify-end">
                    <div className="bg-[#0066B3] p-3 rounded-lg max-w-[80%]">
                      <p className="text-white">I need to reschedule my cleaning for next week.</p>
                      <span className="text-xs text-white/60 mt-1">9:42 AM</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button className="bg-[#0066B3]">
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
