
import { Home, Users, Calendar, DollarSign, MessageSquare } from "lucide-react";

export const staffMenuItems = [
  {
    icon: Home,
    label: "Dashboard",
    path: "/"
  },
  {
    icon: Users,
    label: "Clients",
    path: "/clients"
  },
  {
    icon: Calendar,
    label: "Schedule",
    path: "/schedule"
  },
  {
    icon: DollarSign,
    label: "Quotes",
    path: "/quotes"
  },
  {
    icon: MessageSquare,
    label: "Messages",
    path: "/messages"
  }
];

export const customerMenuItems = [
  {
    icon: Home,
    label: "Dashboard",
    path: "/"
  },
  {
    icon: Calendar,
    label: "Book Service",
    path: "/schedule"
  },
  {
    icon: DollarSign,
    label: "Get Quote",
    path: "/quotes"
  },
  {
    icon: MessageSquare,
    label: "Messages",
    path: "/messages"
  }
];
