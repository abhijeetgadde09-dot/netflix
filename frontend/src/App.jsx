import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { loginUser, registerUser } from "./api";
import ProtectedRoute from "./ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("nf_token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("nf_user");
    return raw ? JSON.parse(raw) : null;
  });

  const authValue = useMemo(
    () => ({
      token,
      user,
      async login(email, password) {
        const data = await loginUser({ email, password });
        localStorage.setItem("nf_token", data.token);
        localStorage.setItem("nf_user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      },
      async register(name, email, password) {
        const data = await registerUser({ name, email, password });
        localStorage.setItem("nf_token", data.token);
        localStorage.setItem("nf_user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      },
      logout() {
        localStorage.removeItem("nf_token");
        localStorage.removeItem("nf_user");
        setToken("");
        setUser(null);
      }
    }),
    [token, user]
  );

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          token ? (
            <Navigate to="/" replace />
          ) : (
            <AuthPage onLogin={authValue.login} onRegister={authValue.register} />
          )
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute token={token}>
            <HomePage token={token} user={user} onLogout={authValue.logout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={token ? "/" : "/auth"} replace />} />
    </Routes>
  );
}

export default App;
