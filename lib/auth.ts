import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User, RegisterData } from '@/types';

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) return false;

          const data = await res.json();
          set({ user: data.user, isAuthenticated: true });
          return true;
        } catch {
          return false;
        }
      },

      register: async (data: RegisterData) => {
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (!res.ok) return false;

          const result = await res.json();
          set({ user: result.user, isAuthenticated: true });
          return true;
        } catch {
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        // Auth state is persisted in localStorage via zustand/persist
      },
    }),
    {
      name: 'golf-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
