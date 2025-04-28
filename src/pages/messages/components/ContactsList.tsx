
import { Search, Users, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Contact } from "@/services/messages";

interface ContactsListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onContactSelect: (contact: Contact) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
  showFilters?: boolean;
}

const ContactsList = ({
  contacts,
  selectedContact,
  onContactSelect,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  showFilters = false,
}: ContactsListProps) => {
  return (
    <Card className="md:col-span-1 h-full flex flex-col">
      <div className="p-4 border-b space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {showFilters && (
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange('all')}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              All
            </Button>
            <Button
              variant={filter === 'client' ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange('client')}
              className="flex-1"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Clients
            </Button>
            <Button
              variant={filter === 'employee' ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange('employee')}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              Team
            </Button>
          </div>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onContactSelect(contact)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedContact?.id === contact.id
                  ? "bg-[#0066B3] text-white"
                  : "hover:bg-[#A8E6EF]/10"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{contact.name || "Unknown Contact"}</p>
                  <p className="text-sm opacity-70">
                    {contact.type === 'employee' && contact.role ? contact.role : 
                     contact.type === 'client' ? 'Client' : ''}
                  </p>
                </div>
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
  );
};

export default ContactsList;
