import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";

export default function Login() {
  const navigate = useNavigate();
  const [controlState, setControlState] = useState({
    isLoggingIn: false,
    isLoginError: false,
    isLoginOk: false,
  });
  const emailRef = useRef();
  const passRef = useRef();
  const { user, login } = useUser();

  async function onLogin() {
    setControlState((prev) => ({
      ...prev,
      isLoggingIn: true,
    }));

    const email = emailRef.current.value;
    const pass = passRef.current.value;
    const result = await login(email, pass);

    setControlState((prev) => ({
      ...prev,
      isLoggingIn: false,
      isLoginError: !result,
      isLoginOk: result,
    }));

    if (result) {
      navigate("/items", { replace: true });
    }
  }

  if (!user.isLoggedIn)
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-head">
            <h1>Welcome back</h1>
            <p className="muted">Sign in to manage items and profile.</p>
          </div>
          <div className="form">
            <label>
              Email
              <input type="text" name="email" id="email" ref={emailRef} />
            </label>
            <label>
              Password
              <input type="password" name="password" id="password" ref={passRef} />
            </label>
            <button onClick={onLogin} disabled={controlState.isLoggingIn}>
              {controlState.isLoggingIn ? "Signing in..." : "Login"}
            </button>
            {controlState.isLoginError && (
              <div className="error-text">Login incorrect</div>
            )}
          </div>
        </div>
      </div>
    );

  return <Navigate to="/items" replace />;
}
