import React, { useEffect, useState } from "react";
import { Modal } from "../../components/Modal";
import { userService } from "./userService";
import { accountService } from "../account/accountService";
import { IUser, IAccount } from "../../types";
import { Users, CreditCard, ShieldAlert } from "lucide-react";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<"users" | "accounts">("users");
  const [users, setUsers] = useState<IUser[]>([]);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (tab === "users") {
          const res = await userService.getAllUsers(1, 20);
          setUsers(res.users);
        } else {
          const res = await accountService.getAllAccounts(1, 20);
          setAccounts(res.accounts);
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar datos de administrador");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, tab]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Panel de Administración">
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Pestañas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setTab("users")}
            className={`btn ${tab === "users" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.85rem" }}
          >
            <Users size={16} /> Usuarios ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("accounts")}
            className={`btn ${tab === "accounts" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.85rem" }}
          >
            <CreditCard size={16} /> Cuentas ({accounts.length})
          </button>
        </div>

        {error && (
          <div style={{ color: "var(--danger)", fontSize: "0.85rem", padding: "8px", backgroundColor: "var(--danger-light)", borderRadius: "6px" }}>
            {error}
          </div>
        )}

        {/* Lista */}
        <div
          style={{
            maxHeight: "360px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
              Cargando registros...
            </div>
          ) : tab === "users" ? (
            users.map((u) => (
              <div
                key={u._id}
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.88rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {u.name} {u.lastname}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{u.email}</div>
                </div>
                {u.isAdmin && <span className="badge badge-admin">Admin</span>}
              </div>
            ))
          ) : (
            accounts.map((acc) => {
              const userName =
                typeof acc.user === "object" && acc.user !== null
                  ? `${acc.user.name} ${acc.user.lastname}`
                  : "Usuario";

              return (
                <div
                  key={acc._id}
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.88rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{userName}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Alias: {acc.alias} • CVU: {acc.cvu}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: "var(--success)" }}>
                    ${Number(acc.balance).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
