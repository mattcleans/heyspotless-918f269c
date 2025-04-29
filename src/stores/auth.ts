
import { create } from 'zustand';

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  userType: 'staff' | 'customer' | 'admin' | null;
  setAuth: (userId: string | null, userType: 'staff' | 'customer' | 'admin' | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  userType: null,
  setAuth: (userId, userType) => 
    set({ isAuthenticated: !!userId, userId, userType }),
  clearAuth: () => set({ isAuthenticated: false, userId: null, userType: null }),
}));
