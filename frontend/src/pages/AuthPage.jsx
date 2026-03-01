import { useState } from "react";

function AuthPage({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await onLogin(email, password);
      } else {
        await onRegister(name, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-overlay" />
      <header className="auth-topbar">
        <h1>NETFLIX</h1>
      </header>

      <main className="auth-card">
        <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="switch-row">
          {mode === "login" ? "New to Netflix?" : "Already have an account?"}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setMode((prev) => (prev === "login" ? "register" : "login"));
              setError("");
            }}
          >
            {mode === "login" ? "Sign up now" : "Sign in"}
          </button>
        </p>
      </main>
    </div>
  );
}

export default AuthPage;
