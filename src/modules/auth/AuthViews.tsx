import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "./authService";
import { userService } from "../user/userService";
import { LogIn, UserPlus } from "lucide-react";

export const AuthViews: React.FC = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register state
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      await login(res.accessToken, res.payload);
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await userService.register({
        name,
        lastname,
        email: regEmail,
        password: regPassword,
      });
      // Auto login tras registro
      const loginRes = await authService.login({
        email: regEmail,
        password: regPassword,
      });
      await login(loginRes.accessToken, loginRes.payload);
    } catch (err: any) {
      setError(err.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "460px",
        margin: "60px auto",
        padding: "0 16px",
      }}
    >
      <div className="card" style={{ padding: "32px" }}>
        {/* Selector de pestañas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            backgroundColor: "var(--bg-elevated)",
            padding: "4px",
            borderRadius: "var(--radius-sm)",
            marginBottom: "24px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError(null);
            }}
            style={{
              padding: "10px",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "0.9rem",
              backgroundColor: tab === "login" ? "var(--bg-surface)" : "transparent",
              color: tab === "login" ? "var(--primary)" : "var(--text-secondary)",
              boxShadow: tab === "login" ? "var(--shadow-sm)" : "none",
            }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setError(null);
            }}
            style={{
              padding: "10px",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "0.9rem",
              backgroundColor: tab === "register" ? "var(--bg-surface)" : "transparent",
              color: tab === "register" ? "var(--primary)" : "var(--text-secondary)",
              boxShadow: tab === "register" ? "var(--shadow-sm)" : "none",
            }}
          >
            Registrarse
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "var(--danger-light)",
              color: "var(--danger)",
              padding: "12px",
              borderRadius: "var(--radius-sm)",
              marginBottom: "16px",
              fontSize: "0.9rem",
              border: "1px solid var(--danger)",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: "var(--success-light)",
              color: "var(--success)",
              padding: "12px",
              borderRadius: "var(--radius-sm)",
              marginBottom: "16px",
              fontSize: "0.9rem",
            }}
          >
            {success}
          </div>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ marginTop: "8px", width: "100%" }}
            >
              <LogIn size={18} />
              {loading ? "Iniciando..." : "Acceder"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Apellido
                </label>
                <input
                  type="text"
                  required
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Pérez"
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="juan@correo.com"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                Contraseña (mín. 8 caracteres)
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ marginTop: "8px", width: "100%" }}
            >
              <UserPlus size={18} />
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
