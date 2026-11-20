import React, { useState } from "react";
import { Modal } from "../../components/Modal";
import { useAuth } from "../../context/AuthContext";
import { userService } from "./userService";
import { authService } from "../auth/authService";
import { KeyRound, Trash2, CheckCircle2 } from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, refreshUser, logout } = useAuth();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delete account state
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!user) return null;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    setPwdLoading(true);
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      setPwdMsg({ type: "success", text: res.message });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPwdMsg({ type: "error", text: err.message || "Error al actualizar contraseña" });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer y la cuenta no debe tener saldo.")) {
      return;
    }
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await userService.deleteAccount();
      logout();
      onClose();
    } catch (err: any) {
      setDeleteError(err.message || "Error al eliminar usuario");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mi Perfil y Seguridad">
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Datos generales */}
        <div style={{ backgroundColor: "var(--bg-elevated)", padding: "14px", borderRadius: "var(--radius-sm)" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
            Datos del Titular
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "2px" }}>
            {user.name} {user.lastname}
          </div>
          <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            {user.email}
          </div>
          {user.isAdmin && (
            <div style={{ marginTop: "6px" }}>
              <span className="badge badge-admin">Administrador</span>
            </div>
          )}
        </div>

        {/* Cambio de Contraseña */}
        <div>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <KeyRound size={16} /> Cambiar Contraseña
          </h4>

          {pwdMsg && (
            <div
              style={{
                fontSize: "0.85rem",
                padding: "8px 12px",
                borderRadius: "6px",
                marginBottom: "12px",
                backgroundColor: pwdMsg.type === "success" ? "var(--success-light)" : "var(--danger-light)",
                color: pwdMsg.type === "success" ? "var(--success)" : "var(--danger)",
              }}
            >
              {pwdMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="password"
              placeholder="Contraseña Actual"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nueva Contraseña (mín 8 caracteres)"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit" disabled={pwdLoading} className="btn btn-secondary" style={{ width: "100%" }}>
              {pwdLoading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </form>
        </div>

        {/* Zona Peligro: Eliminar Cuenta */}
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
            Para eliminar tu cuenta, tu saldo debe estar exactamente en <strong>$0.00</strong>.
          </div>
          {deleteError && (
            <div style={{ color: "var(--danger)", fontSize: "0.85rem", marginBottom: "8px" }}>
              {deleteError}
            </div>
          )}
          <button
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            className="btn btn-danger"
            style={{ width: "100%", fontSize: "0.85rem" }}
          >
            <Trash2 size={16} />
            {deleteLoading ? "Eliminando..." : "Eliminar Cuenta"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
