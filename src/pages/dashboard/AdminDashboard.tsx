
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth";
import { Navigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { userType } = useAuthStore();

  // Redirect non-admin users
  if (userType !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  if (usersLoading || bookingsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <h3 className="font-medium">Total Users</h3>
          <p className="text-2xl font-bold">{users?.length || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium">Staff Members</h3>
          <p className="text-2xl font-bold">
            {users?.filter(user => user.user_type === 'staff').length || 0}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium">Customers</h3>
          <p className="text-2xl font-bold">
            {users?.filter(user => user.user_type === 'customer').length || 0}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium">Recent Bookings</h3>
          <p className="text-2xl font-bold">{bookings?.length || 0}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.slice(0, 5).map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell className="capitalize">{user.user_type}</TableCell>
                <TableCell>{user.phone || 'N/A'}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  {new Date(booking.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell className="capitalize">{booking.status}</TableCell>
                <TableCell>{booking.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminDashboard;
