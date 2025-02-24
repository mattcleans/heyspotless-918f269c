
import { useAuthStore } from "@/App";
import { Navigate } from "react-router-dom";
import ClientDashboard from "./dashboard/ClientDashboard";
import StaffDashboard from "./dashboard/StaffDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";

const IndexPage = () => {
  const { isAuthenticated, userType } = useAuthStore();

  // For staff and admin users, require authentication
  if (userType === 'staff' || userType === 'admin') {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    if (userType === 'admin') {
      return <AdminDashboard />;
    }
    return <StaffDashboard />;
  }

  // For all other users (customers or anonymous), show the client dashboard
  return <ClientDashboard />;
};

export default IndexPage;
