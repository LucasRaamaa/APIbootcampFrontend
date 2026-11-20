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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <Clock size={20} className="text-blue-600 dark:text-blue-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Últimos Movimientos</h3>
        </div>
        <button
          onClick={() => fetchMovements(page)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          title="Actualizar movimientos"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refrescar</span>
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-xl text-sm bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
          {error}
        </div>
      )}

      {movements.length === 0 && !loading ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          Aún no registras ningún movimiento en tu cuenta.
        </div>
      ) : (
        <div className="space-y-2.5">
          {movements.map((mov) => {
            const isDeposit = mov.type === "deposit";
            // Una transacción suma dinero si es depósito o si el saldo final es mayor al anterior
            const isIncoming = isDeposit || mov.balanceAfter > mov.balanceBefore;

            let title = "Transferencia Enviada";
            if (isDeposit) {
              title = "Depósito Recibido";
            } else if (isIncoming) {
              title = "Transferencia Recibida";
            }

            const dateFormatted = new Date(mov.createdAt).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            const counterpartText = mov.counterpartAccount
              ? isIncoming
                ? `De: ${mov.counterpartAccount.alias || mov.counterpartAccount.cvu}`
                : `A: ${mov.counterpartAccount.alias || mov.counterpartAccount.cvu}`
              : null;

            return (
              <div
                key={mov._id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncoming
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isIncoming ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {dateFormatted}
                      {counterpartText && <span> • {counterpartText}</span>}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-extrabold text-sm sm:text-base ${
                      isIncoming
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isIncoming ? "+" : "-"} $
                    {Number(mov.amount).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-[11px] text-slate-400">
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
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition"
          >
            Anterior
          </button>
          <span className="text-xs text-slate-500">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};
