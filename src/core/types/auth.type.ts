export interface IAuthState {
  authStore_isAuthenticated: boolean;
  authStore_isLoading: boolean;
  authStore_error: string | null;
  authStore_initializeAuth: () => void;
  authStore_login: (email: string) => void;
  authStore_logout: () => void;
}

export interface AuthRouteWrapperProps {
  children: React.ReactNode;
  publicOnly?: boolean;
  protectedRoute?: boolean;
}
