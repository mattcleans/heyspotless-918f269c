
import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";
import type { Message } from "@/services/messages";

interface GuestChatProps {
  messages: Message[];
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

export const GuestChat = ({ 
  messages, 
  messageInput, 
  onMessageChange, 
  onSendMessage 
}: GuestChatProps) => {
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
    <div className="h-[calc(100vh-5rem)] p-6">
      <div className="h-full">
        <Card className="h-full flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-[#1B365D]">Hey Spotless HQ</h2>
              <p className="text-sm text-[#1B365D]/60">Customer Support</p>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex gap-2 items-start">
                <div className="p-3 rounded-lg max-w-[80%] bg-[#0066B3]/10 text-[#1B365D]">
                  <p>Welcome to Hey Spotless! How can we help you today?</p>
                  <span className="text-xs mt-1 block text-[#1B365D]/60">
                    {formatMessageTime(new Date())}
                  </span>
                </div>
              </div>
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
      </div>
    </div>
  );
};
