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
    <div
      className="card"
      style={{
        background: "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)",
        border: "1px solid var(--border-color)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text-secondary)",
              fontWeight: 700,
            }}
          >
            {account.name || "Cuenta Corriente"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <span style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
              {showBalance
                ? `$ ${Number(account.balance).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "••••••••"}
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              style={{
                background: "transparent",
                color: "var(--text-secondary)",
                padding: "6px",
              }}
              title={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onOpenDeposit}
            className="btn btn-primary"
            style={{ backgroundColor: "var(--success)" }}
          >
            <ArrowDownLeft size={18} />
            <span>Depositar</span>
          </button>
          <button onClick={onOpenTransfer} className="btn btn-primary">
            <ArrowUpRight size={18} />
            <span>Transferir</span>
          </button>
        </div>
      </div>

      {/* Datos Bancarios: CVU y Alias */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "12px",
          marginTop: "16px",
          paddingTop: "16px",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
              CVU
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "0.95rem", fontWeight: 700 }}>
              {account.cvu}
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(account.cvu, "cvu")}
            style={{ background: "transparent", color: "var(--text-secondary)" }}
            title="Copiar CVU"
          >
            {copiedField === "cvu" ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
          </button>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
              ALIAS
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>{account.alias}</div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => copyToClipboard(account.alias, "alias")}
              style={{ background: "transparent", color: "var(--text-secondary)" }}
              title="Copiar Alias"
            >
              {copiedField === "alias" ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
            </button>
            <button
              onClick={onOpenAlias}
              style={{ background: "transparent", color: "var(--primary)" }}
              title="Modificar Alias"
            >
              <Edit3 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
