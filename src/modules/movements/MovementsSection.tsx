import React, { useEffect, useState, useCallback } from "react";
import { IMovement, IPagination } from "../../types";
import { movementsService } from "./movementsService";
import { ArrowDownLeft, ArrowUpRight, Clock, RefreshCw } from "lucide-react";

export const MovementsSection: React.FC<{ refreshTrigger?: number }> = ({ refreshTrigger }) => {
  const [movements, setMovements] = useState<IMovement[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await movementsService.getMyMovements(p, 5);
      setMovements(res.movements);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err.message || "Error al cargar movimientos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovements(page);
  }, [page, refreshTrigger, fetchMovements]);

  return (
    <div className="card" style={{ marginTop: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Clock size={20} color="var(--primary)" />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Últimos Movimientos</h3>
        </div>
        <button
          onClick={() => fetchMovements(page)}
          className="btn btn-secondary"
          style={{ padding: "6px 12px", fontSize: "0.85rem" }}
          title="Actualizar movimientos"
        >
          <RefreshCw size={15} className={loading ? "spin" : ""} />
          <span>Refrescar</span>
        </button>
      </div>

      {error && (
        <div style={{ color: "var(--danger)", padding: "10px", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      {movements.length === 0 && !loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "36px 16px",
            color: "var(--text-muted)",
          }}
        >
          Aún no registras ningún movimiento en tu cuenta.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {movements.map((mov) => {
            const isDeposit = mov.type === "deposit";
            const dateFormatted = new Date(mov.createdAt).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={mov._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  backgroundColor: "var(--bg-elevated)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      backgroundColor: isDeposit ? "var(--success-light)" : "var(--danger-light)",
                      color: isDeposit ? "var(--success)" : "var(--danger)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isDeposit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      {isDeposit ? "Depósito Recibido" : "Transferencia Enviada"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {dateFormatted}
                      {mov.counterpartAccount && ` • A: ${mov.counterpartAccount.alias || mov.counterpartAccount.cvu}`}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      color: isDeposit ? "var(--success)" : "var(--danger)",
                    }}
                  >
                    {isDeposit ? "+" : "-"} $
                    {Number(mov.amount).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Saldo: ${Number(mov.balanceAfter).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border-color)",
          }}
        >
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn btn-secondary"
            style={{ padding: "6px 14px", fontSize: "0.85rem" }}
          >
            Anterior
          </button>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="btn btn-secondary"
            style={{ padding: "6px 14px", fontSize: "0.85rem" }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};
