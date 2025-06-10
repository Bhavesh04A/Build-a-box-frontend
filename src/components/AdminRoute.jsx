import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // Loading state: जब तक user context null है, कुछ मत दिखाओ
  if (user === undefined) return null; // या loading spinner दिखा सकते हैं

  // Auth check
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin-login" />;
  }
  return children;
}
