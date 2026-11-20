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
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {error && (
          <div style={{ color: "var(--danger)", fontSize: "0.85rem", backgroundColor: "var(--danger-light)", padding: "10px", borderRadius: "6px" }}>
            {error}
          </div>
        )}
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
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
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", backgroundColor: "var(--success)" }}>
          <ArrowDownLeft size={18} />
          {loading ? "Procesando..." : "Confirmar Depósito"}
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
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {error && (
          <div style={{ color: "var(--danger)", fontSize: "0.85rem", backgroundColor: "var(--danger-light)", padding: "10px", borderRadius: "6px" }}>
            {error}
          </div>
        )}
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
            Destinatario (CVU o Alias)
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="ej: sol.rio o 0000912345"
            autoFocus
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
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
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
          <ArrowUpRight size={18} />
          {loading ? "Transfiriendo..." : "Enviar Dinero"}
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
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {error && (
          <div style={{ color: "var(--danger)", fontSize: "0.85rem", backgroundColor: "var(--danger-light)", padding: "10px", borderRadius: "6px" }}>
            {error}
          </div>
        )}
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
            Nuevo Alias
          </label>
          <input
            type="text"
            required
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="ej: mi.cuenta.banco"
            autoFocus
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
          <Edit3 size={18} />
          {loading ? "Actualizando..." : "Guardar Alias"}
        </button>
      </form>
    </Modal>
  );
};
