import { create } from "zustand";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  setLoading: (value: boolean) => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  setLoading: (value: boolean) => set({ isLoading: value }),
}));

export default useAuthStore;
