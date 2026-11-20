import React, { useEffect, useState } from "react";
import { Modal } from "../../components/Modal";
import { userService } from "./userService";
import { accountService } from "../account/accountService";
import { IUser, IAccount } from "../../types";
import { Users, CreditCard } from "lucide-react";

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
      <div className="space-y-4">
        {/* Selector de pestañas */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setTab("users")}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              tab === "users"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Users size={15} />
            <span>Usuarios ({users.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("accounts")}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              tab === "accounts"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <CreditCard size={15} />
            <span>Cuentas ({accounts.length})</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
            {error}
          </div>
        )}

        {/* Lista */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Cargando registros...
            </div>
          ) : tab === "users" ? (
            users.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {u.name} {u.lastname}
                  </div>
                  <div className="text-slate-400">{u.email}</div>
                </div>
                {u.isAdmin && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    Admin
                  </span>
                )}
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
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{userName}</div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      Alias: {acc.alias} • CVU: {acc.cvu}
                    </div>
                  </div>
                  <div className="font-extrabold text-emerald-600 dark:text-emerald-400">
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
