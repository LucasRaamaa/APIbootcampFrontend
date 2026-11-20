import React, { useState } from "react";
import { IAccount } from "../../types";
import { Eye, EyeOff, Copy, Check, ArrowDownLeft, ArrowUpRight, Edit3 } from "lucide-react";

interface AccountCardProps {
  account: IAccount | null;
  onOpenDeposit: () => void;
  onOpenTransfer: () => void;
  onOpenAlias: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onOpenDeposit,
  onOpenTransfer,
  onOpenAlias,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!account) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {account.name || "Cuenta Corriente"}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {showBalance
                ? `$ ${Number(account.balance).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "••••••••"}
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
            >
              {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex gap-2">
          <button
            onClick={onOpenDeposit}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-[0.98] transition"
          >
            <ArrowDownLeft size={18} />
            <span>Depositar</span>
          </button>
          <button
            onClick={onOpenTransfer}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 active:scale-[0.98] transition"
          >
            <ArrowUpRight size={18} />
            <span>Transferir</span>
          </button>
        </div>
      </div>

      {/* Datos Bancarios: CVU y Alias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {/* CVU */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              CVU
            </div>
            <div className="font-mono font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
              {account.cvu}
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(account.cvu, "cvu")}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
            title="Copiar CVU"
          >
            {copiedField === "cvu" ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>

        {/* ALIAS */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Alias
            </div>
            <div className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
              {account.alias}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => copyToClipboard(account.alias, "alias")}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
              title="Copiar Alias"
            >
              {copiedField === "alias" ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
            <button
              onClick={onOpenAlias}
              className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
              title="Modificar Alias"
            >
              <Edit3 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
