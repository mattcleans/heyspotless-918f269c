
import { useAuthStore } from "@/App";
import { Navigate } from "react-router-dom";
import ClientDashboard from "./dashboard/ClientDashboard";
import StaffDashboard from "./dashboard/StaffDashboard";

const IndexPage = () => {
  const { isAuthenticated, userType } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (userType === 'staff') {
    return <StaffDashboard />;
  }

  return <ClientDashboard />;
};

export default IndexPage;
