import React, { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "../../hooks/authStore";
import { Box, CircularProgress, Typography } from "@mui/material";
import { localStorage_getLoggedInUser } from "../../services/localStorageService";
import type { AuthRouteWrapperProps } from "../../types/auth.type";

const AuthRouteWrapper: React.FC<AuthRouteWrapperProps> = ({
  children,
  publicOnly,
  protectedRoute,
}) => {
  const { authStore_isAuthenticated, authStore_isLoading, authStore_initializeAuth } =
    useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!authStore_isAuthenticated && !authStore_isLoading && localStorage_getLoggedInUser()) {
      authStore_initializeAuth();
    }
  }, [authStore_isAuthenticated, authStore_isLoading, authStore_initializeAuth]);

  if (authStore_isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }} id='AuthRouteWrapper-Typography-loading'>
          Loading
        </Typography>
      </Box>
    );
  }

  if (publicOnly && authStore_isAuthenticated) {
    return (
      <Navigate
        to="/todos"
        state={{ from: location.pathname }}
        replace={true}
      />
    );
  }

  if (protectedRoute && !authStore_isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace={true}
      />
    );
  }

  return <>{children}</>;
};

export default AuthRouteWrapper;
