import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { JSX } from "react";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { getAccessToken } = useAuth();

  if (getAccessToken()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};
