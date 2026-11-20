import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { AuthViews } from "./modules/auth/AuthViews";
import { AccountCard } from "./modules/account/AccountCard";
import {
  DepositModal,
  TransferModal,
  ChangeAliasModal,
} from "./modules/account/AccountModals";
import { MovementsSection } from "./modules/movements/MovementsSection";
import { UserProfileModal } from "./modules/user/UserProfileModal";
import { AdminPanel } from "./modules/user/AdminPanel";
import { accountService } from "./modules/account/accountService";
import { IAccount } from "./types";

export const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [account, setAccount] = useState<IAccount | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Modals state
  const [showDeposit, setShowDeposit] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showAlias, setShowAlias] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const fetchAccount = useCallback(async () => {
    if (!user) return;
    try {
      const data = await accountService.getMyAccount();
      setAccount(data);
    } catch (err) {
      console.error("Error al cargar la cuenta:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount, refreshKey]);

  const handleRefresh = () => {
    fetchAccount();
    setRefreshKey((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">
        Cargando billetera virtual...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar
        onOpenProfile={() => setShowProfile(true)}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      <main className="flex-1">
        {!user ? (
          <AuthViews />
        ) : (
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            {/* Tarjeta de Cuenta */}
            <AccountCard
              account={account}
              onOpenDeposit={() => setShowDeposit(true)}
              onOpenTransfer={() => setShowTransfer(true)}
              onOpenAlias={() => setShowAlias(true)}
            />

            {/* Listado de Movimientos */}
            <MovementsSection refreshTrigger={refreshKey} />

            {/* Modales de Operaciones */}
            <DepositModal
              isOpen={showDeposit}
              onClose={() => setShowDeposit(false)}
              onSuccess={handleRefresh}
            />

            <TransferModal
              isOpen={showTransfer}
              onClose={() => setShowTransfer(false)}
              onSuccess={handleRefresh}
            />

            {account && (
              <ChangeAliasModal
                isOpen={showAlias}
                currentAlias={account.alias}
                onClose={() => setShowAlias(false)}
                onSuccess={handleRefresh}
              />
            )}

            <UserProfileModal
              isOpen={showProfile}
              onClose={() => setShowProfile(false)}
            />

            <AdminPanel
              isOpen={showAdmin}
              onClose={() => setShowAdmin(false)}
            />
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        Bank Digital Wallet • Bootcamp 2026
      </footer>
    </div>
  );
};

export default App;
