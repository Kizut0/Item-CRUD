import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";

export default function RequireAuth({ children }) {
  const { user } = useUser();

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
