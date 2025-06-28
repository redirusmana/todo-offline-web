import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./core/hooks/authStore";
import LoginPage from "./modules/auth/LoginPage";
import MainPage from "./modules/todo/MainPage";
import AuthRouteWrapper from "./core/components/auth/AuthRouteWrapper";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthRouteWrapper publicOnly>
        <LoginPage />
      </AuthRouteWrapper>
    ),
  },
  {
    path: "/todos",
    element: (
      <AuthRouteWrapper protectedRoute>
        <MainPage />
      </AuthRouteWrapper>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/todos" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/todos" replace />,
  },
]);

function App() {
  const { authStore_initializeAuth } = useAuthStore();

  useEffect(() => {
    authStore_initializeAuth();
  }, [authStore_initializeAuth]);

  return <RouterProvider router={router} />;
}

export default App;
