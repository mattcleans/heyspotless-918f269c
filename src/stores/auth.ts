
import { create } from 'zustand';

interface AuthStore {
  userId: string | null;
  userType: 'staff' | 'customer' | 'admin' | null;
  setAuth: (userId: string, userType: 'staff' | 'customer' | 'admin') => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  userId: null,
  userType: null,
  setAuth: (userId, userType) => set({ userId, userType }),
  clearAuth: () => set({ userId: null, userType: null }),
}));
