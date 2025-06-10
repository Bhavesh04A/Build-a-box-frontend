import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, token } = useAuth();
  if (!user || !token) return <Navigate to="/user-login" replace />;
  return children;
}
