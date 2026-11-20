import React, { useState } from "react";
import { Modal } from "../../components/Modal";
import { accountService } from "./accountService";
import { ArrowDownLeft, ArrowUpRight, Edit3 } from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await accountService.deposit(Number(amount));
      setAmount("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al depositar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Depositar Dinero">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl text-sm bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Monto a ingresar ($)
          </label>
          <input
            type="number"
            min="1"
            step="any"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ej: 5000"
            autoFocus
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition"
        >
          <ArrowDownLeft size={18} />
          <span>{loading ? "Procesando..." : "Confirmar Depósito"}</span>
        </button>
      </form>
    </Modal>
  );
};

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await accountService.transfer(destination, Number(amount));
      setDestination("");
      setAmount("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al realizar la transferencia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Transferencia">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl text-sm bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Destinatario (CVU o Alias)
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="ej: sol.rio o 0000912345"
            autoFocus
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Monto a transferir ($)
          </label>
          <input
            type="number"
            min="1"
            step="any"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ej: 1500"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
        >
          <ArrowUpRight size={18} />
          <span>{loading ? "Transfiriendo..." : "Enviar Dinero"}</span>
        </button>
      </form>
    </Modal>
  );
};

interface ChangeAliasModalProps {
  isOpen: boolean;
  currentAlias: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangeAliasModal: React.FC<ChangeAliasModalProps> = ({
  isOpen,
  currentAlias,
  onClose,
  onSuccess,
}) => {
  const [alias, setAlias] = useState(currentAlias);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await accountService.updateAlias(alias.trim().toLowerCase());
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al modificar alias");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modificar Alias">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl text-sm bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Nuevo Alias
          </label>
          <input
            type="text"
            required
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="ej: mi.cuenta.banco"
            autoFocus
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
        >
          <Edit3 size={18} />
          <span>{loading ? "Actualizando..." : "Guardar Alias"}</span>
        </button>
      </form>
    </Modal>
  );
};
