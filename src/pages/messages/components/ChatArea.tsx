
import { MessageSquare, Phone, Video, History as HistoryIcon, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Contact, Message } from "@/services/messages";

interface ChatAreaProps {
  selectedContact: Contact | null;
  messages: Message[];
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  onDeleteMessage: (messageId: string) => void;
  userId?: string | null;
}

const ChatArea = ({
  selectedContact,
  messages,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  onDeleteMessage,
  userId,
}: ChatAreaProps) => {
  if (!selectedContact) {
    return (
      <Card className="md:col-span-3 h-full flex flex-col">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-[#1B365D]/60">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      </Card>
    );
  }

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
            <HistoryIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 items-start group ${
                message.sender_id === userId ? 'justify-end' : ''
              }`}
            >
              {message.sender_id === userId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDeleteMessage(message.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.sender_id === userId
                    ? 'bg-[#0066B3] text-white'
                    : 'bg-[#0066B3]/10 text-[#1B365D]'
                }`}
              >
                <p>{message.content}</p>
                <span className={`text-xs mt-1 block ${
                  message.sender_id === userId ? 'text-white/60' : 'text-[#1B365D]/60'
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
            onChange={(e) => onMessageInputChange(e.target.value)}
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

export default ChatArea;
