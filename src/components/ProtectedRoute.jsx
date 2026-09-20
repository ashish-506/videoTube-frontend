import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children }) {
  const { user, checkingAuth } = useAuth();
  const location = useLocation();

  // Wait for the initial /current-user check to resolve before deciding —
  // otherwise a logged-in user would flash to /login on every page refresh
  // while that request is still in flight.
  if (checkingAuth) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
