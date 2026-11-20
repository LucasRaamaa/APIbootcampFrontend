import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, LogOut, User, ShieldCheck } from "lucide-react";

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfile, onOpenAdmin }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      style={{
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-color)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "14px",
          paddingBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: "var(--primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.1rem",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
            }}
          >
            B
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
            Bootcamp<span style={{ color: "var(--primary)" }}>Bank</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            title="Cambiar tema"
            style={{ padding: "8px 12px" }}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user && (
            <>
              {user.isAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="btn"
                  style={{
                    backgroundColor: "var(--warning-light)",
                    color: "var(--warning)",
                    border: "1px solid var(--warning)",
                    padding: "8px 12px",
                    fontSize: "0.85rem",
                  }}
                  title="Panel de Administrador"
                >
                  <ShieldCheck size={18} />
                  <span>Admin</span>
                </button>
              )}

              <button
                onClick={onOpenProfile}
                className="btn btn-secondary"
                style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <User size={18} />
                <span style={{ fontWeight: 600 }}>{user.name}</span>
              </button>

              <button
                onClick={logout}
                className="btn"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)",
                  padding: "8px 12px",
                }}
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
