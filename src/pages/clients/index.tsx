
import { useAuthStore } from "@/App";
import { Navigate } from "react-router-dom";
import ClientDashboard from "./components/ClientDashboard";

const ClientsPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <ClientDashboard />;
};

export default ClientsPage;
