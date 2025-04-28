
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id?: string;
}

const GuestChat = () => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          content: messageInput,
          sender_type: 'guest',
          status: 'unread'
        });

      if (error) throw error;
      
      // Add message to local state
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        content: messageInput,
        created_at: new Date().toISOString(),
        sender_id: 'guest'
      }]);
      
      toast.success("Message sent successfully!");
      setMessageInput("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Couldn't send message. Please try again.");
    }
  };

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
                    {format(new Date(), 'h:mm a')}
                  </span>
                </div>
              </div>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 items-start ${
                    message.sender_id === 'guest' ? 'justify-end' : ''
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      message.sender_id === 'guest'
                        ? 'bg-[#0066B3] text-white'
                        : 'bg-[#0066B3]/10 text-[#1B365D]'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className={`text-xs mt-1 block ${
                      message.sender_id === 'guest' ? 'text-white/60' : 'text-[#1B365D]/60'
                    }`}>
                      {format(new Date(message.created_at), 'h:mm a')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

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
        </Card>
      </div>
    </div>
  );
};

export default GuestChat;
