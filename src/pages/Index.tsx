
import { useAuthStore } from "@/App";
import { Navigate } from "react-router-dom";
import ClientDashboard from "./dashboard/ClientDashboard";
import StaffDashboard from "./dashboard/StaffDashboard";

const IndexPage = () => {
  const { isAuthenticated, userType } = useAuthStore();

  // For staff users, require authentication
  if (userType === 'staff') {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    return <StaffDashboard />;
  }

  // For all other users (customers or anonymous), show the client dashboard
  return <ClientDashboard />;
};

export default IndexPage;

