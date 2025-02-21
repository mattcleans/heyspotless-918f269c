
import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Phone, Video, History } from "lucide-react";
import { format } from "date-fns";
import type { Contact, Message } from "@/services/messages";

interface ChatAreaProps {
  selectedContact: Contact;
  messages: Message[];
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

export const ChatArea = ({
  selectedContact,
  messages,
  messageInput,
  onMessageChange,
  onSendMessage,
}: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatMessageTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Card className="md:col-span-3 h-full flex flex-col">
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

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
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

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            className="flex-1"
            value={messageInput}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSendMessage();
              }
            }}
          />
          <Button
            className="bg-[#0066B3]"
            onClick={onSendMessage}
            disabled={!messageInput.trim()}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
