import { create } from "zustand";
import {
  localStorage_getLoggedInUser,
  localStorage_loginUser,
  localStorage_logoutUser,
} from "../services/localStorageService";
import type { IAuthState } from "../types/auth.type";

export const useAuthStore = create<IAuthState>((set) => ({
  authStore_isAuthenticated: false,
  authStore_isLoading: true,
  authStore_error: null,

  authStore_initializeAuth: () => {
    set({ authStore_isLoading: true, authStore_error: null });
    try {
      const user = localStorage_getLoggedInUser();
      set({ authStore_isAuthenticated: !!user, authStore_isLoading: false });
    } catch (error: unknown) {
      set({
        authStore_isAuthenticated: false,
        authStore_isLoading: false,
        authStore_error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  authStore_login: (email: string) => {
    localStorage_loginUser(email);
    set({ authStore_isAuthenticated: true, authStore_error: null });
  },

  authStore_logout: () => {
    localStorage_logoutUser();
    set({ authStore_isAuthenticated: false, authStore_error: null });
  },
}));
