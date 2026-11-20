import React, { useState } from "react";
import { Modal } from "../../components/Modal";
import { useAuth } from "../../context/AuthContext";
import { userService } from "./userService";
import { authService } from "../auth/authService";
import { KeyRound, Trash2 } from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

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
      <div className="space-y-5">
        {/* Datos generales */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Datos del Titular
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {user.name} {user.lastname}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {user.email}
          </div>
          {user.isAdmin && (
            <div className="mt-2">
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Administrador
              </span>
            </div>
          )}
        </div>

        {/* Cambio de Contraseña */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
            <KeyRound size={15} /> Cambiar Contraseña
          </h4>

          {pwdMsg && (
            <div
              className={`p-3 rounded-xl text-xs mb-3 border ${
                pwdMsg.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50"
              }`}
            >
              {pwdMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <input
              type="password"
              placeholder="Contraseña Actual"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
            />
            <input
              type="password"
              placeholder="Nueva Contraseña (mín 8 caracteres)"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
            />
            <button
              type="submit"
              disabled={pwdLoading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 disabled:opacity-50 transition"
            >
              {pwdLoading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </form>
        </div>

        {/* Zona Peligro: Eliminar Cuenta */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400 mb-2">
            Para eliminar tu cuenta, tu saldo debe estar exactamente en <strong className="text-slate-600 dark:text-slate-300">$0.00</strong>.
          </div>
          {deleteError && (
            <div className="p-2.5 rounded-xl text-xs mb-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
              {deleteError}
            </div>
          )}
          <button
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center gap-1.5 transition"
          >
            <Trash2 size={15} />
            <span>{deleteLoading ? "Eliminando..." : "Eliminar Cuenta"}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
