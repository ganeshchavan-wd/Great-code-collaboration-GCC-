import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Login.css"; 

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); 

    try {
      const res = await API.post("/auth/login", { email, password });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* LEFT SIDE BRANDING */}
        <div className="login-left">
          <div className="logo-glow"></div>
          <div className="left-content">
            <h1 className="logo-text">GCC</h1>
            <div className="divider"></div>
            <h2 className="heading">Welcome Back</h2>
            <p className="tagline">
              Collaborate seamlessly,<br />
              code in real-time,<br />
              and build amazing projects together.
            </p>
            <div className="status-badge">
              <span className="dot"></span>
              Real-Time Collaboration Platform
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="login-right">
          <form onSubmit={loginUser} className="login-form">
            <h2 className="form-title">Login</h2>
            <p className="form-subtitle">Access your GCC workspace</p>

            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                required
              />
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
              />
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <p className="login-footer">
              Don't have an account?
              <Link to="/register" className="login-link">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
