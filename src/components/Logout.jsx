import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";

export default function Logout() {
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useUser();

  async function onLogout() {
    await logout();
    setIsLoading(false);
  }

  useEffect(() => {
    onLogout();
  }, []);

  if (isLoading) {
    return (
      <>
        <h3>Logging out...</h3>
      </>
    );
  }

  return <Navigate to="/login" replace />;
}
