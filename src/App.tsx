import { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AddLinkDialog } from "./components/AddLinkDialog";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { AppShell } from "./components/AppShell";
import { CategoryDialog } from "./components/CategoryDialog";
import { ClipboardPrompt } from "./components/ClipboardPrompt";
import { FloatingAddButton } from "./components/FloatingAddButton";
import { PinGate } from "./components/PinGate";
import { ReminderDialog } from "./components/ReminderDialog";
import { ToastViewport } from "./components/ToastViewport";
import { useAppBootstrap } from "./hooks/useAppBootstrap";
import { useClipboardWatcher } from "./hooks/useClipboardWatcher";
import { useReminderEngine } from "./hooks/useReminderEngine";
import { useVaultLock } from "./hooks/useVaultLock";
import { MobileLanding } from "./components/MobileLanding";
import { CategoriesPage } from "./pages/CategoriesPage";
import { HomePage } from "./pages/HomePage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatsPage } from "./pages/StatsPage";
import { useAppStore } from "./store/app-store";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-vault-background z-50">
      <div className="text-center space-y-4 animate-pulse">
        <h2 className="text-3xl font-bold text-vault-text tracking-tight uppercase">Vault X</h2>
        <p className="text-sm text-vault-muted font-medium">Synchronizing Secure Data...</p>
      </div>
    </div>
  );
}

export default function App() {
  useAppBootstrap();
  const ready = useAppStore((state) => state.ready);
  useClipboardWatcher(ready);
  useReminderEngine(ready);
  useVaultLock(ready);

  const [showMobileLanding, setShowMobileLanding] = useState(() => {
    // Initial check on mount
    if (typeof window === "undefined") return false;

    const isMobileSize = window.innerWidth < 768;
    const isMobileUA = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isBypassed = localStorage.getItem("vaultx_mobile_bypass") === "true";

    return (isMobileSize || isMobileUA || hasTouch) && !isBypassed;
  });

  const handleContinue = () => {
    localStorage.setItem("vaultx_mobile_bypass", "true");
    setShowMobileLanding(false);
  };

  return (
    <>
      <AnimatedBackground />
      {!ready ? (
        <LoadingScreen />
      ) : showMobileLanding ? (
        <MobileLanding onContinue={handleContinue} />
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route element={<AppShell />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>

          <FloatingAddButton />
          <AddLinkDialog />
          <ReminderDialog />
          <CategoryDialog />
          <ClipboardPrompt />
          <PinGate />
          <ToastViewport />
        </>
      )}
    </>
  );
}
