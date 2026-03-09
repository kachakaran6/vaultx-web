import { useEffect, useState } from "react";
import { Download, KeyRound, Lock, ShieldCheck, Smartphone, Upload } from "lucide-react";
import { useAppStore } from "../store/app-store";
import { pushToast } from "../store/toast-store";
import { ensureNotificationPermission, isNotificationSupported } from "../utils/notifications";
import { verifyPin } from "../utils/security";

const LOCK_TIMEOUTS = [30, 60, 300];

export function SettingsPage() {
  const state = useAppStore();
  const [pinCurrent, setPinCurrent] = useState("");
  const [pinNext, setPinNext] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinBusy, setPinBusy] = useState(false);
  const [backupPassword, setBackupPassword] = useState("");
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPassword, setImportPassword] = useState("");
  const [importing, setImporting] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handlePinSave = async () => {
    if (pinNext.length !== 4 || pinNext !== pinConfirm) {
      pushToast({
        tone: "warning",
        title: "PIN mismatch",
        description: "Enter the same 4-digit PIN twice."
      });
      return;
    }

    setPinBusy(true);
    if (state.settings.pinEnabled && state.settings.pinHash) {
      const valid = await verifyPin(pinCurrent, state.settings.pinHash);
      if (!valid) {
        setPinBusy(false);
        pushToast({
          tone: "warning",
          title: "Incorrect PIN",
          description: "Enter the current PIN before changing it."
        });
        return;
      }
    }

    await state.setPin(pinNext);
    setPinBusy(false);
    setPinCurrent("");
    setPinNext("");
    setPinConfirm("");
  };

  const handlePinDisable = async () => {
    if (!state.settings.pinHash) {
      await state.clearPin();
      return;
    }

    const valid = await verifyPin(pinCurrent, state.settings.pinHash);
    if (!valid) {
      pushToast({
        tone: "warning",
        title: "Incorrect PIN",
        description: "Enter the current PIN to disable protection."
      });
      return;
    }

    await state.clearPin();
    setPinCurrent("");
    setPinNext("");
    setPinConfirm("");
  };

  const handleImport = async () => {
    if (!importFile) {
      return;
    }

    setImporting(true);
    try {
      const text = await importFile.text();
      await state.importVault(text, {
        mode: importMode,
        password: importPassword || undefined
      });
      setImportFile(null);
      setImportPassword("");
    } catch (error) {
      pushToast({
        tone: "danger",
        title: "Import failed",
        description: error instanceof Error ? error.message : "Backup import could not be completed."
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-4xl">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-vault-text">Settings</h1>
        <p className="mt-1 text-sm text-vault-muted">Manage your vault's security, data, and preferences.</p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-vault-border">
          <KeyRound className="text-vault-primary" size={20} />
          <h2 className="text-lg font-bold text-vault-text">Security</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {state.settings.pinEnabled && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">Current PIN</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinCurrent}
                onChange={(e) => setPinCurrent(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="w-full h-11 px-4 rounded-xl border border-vault-border bg-vault-card text-sm text-vault-text outline-none focus:border-vault-primary/50 transition-all"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">New PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinNext}
              onChange={(e) => setPinNext(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="w-full h-11 px-4 rounded-xl border border-vault-border bg-vault-card text-sm text-vault-text outline-none focus:border-vault-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">Confirm PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinConfirm}
              onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="w-full h-11 px-4 rounded-xl border border-vault-border bg-vault-card text-sm text-vault-text outline-none focus:border-vault-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={pinBusy || pinNext.length !== 4 || pinNext !== pinConfirm}
            onClick={() => void handlePinSave()}
            className="px-6 py-2.5 rounded-xl bg-vault-primary text-sm font-bold text-white shadow-subtle transition hover:opacity-90 disabled:opacity-50"
          >
            {state.settings.pinEnabled ? "Update PIN" : "Enable PIN"}
          </button>
          {state.settings.pinEnabled && (
            <>
              <button
                type="button"
                onClick={() => void handlePinDisable()}
                className="px-6 py-2.5 rounded-xl border border-vault-danger/30 bg-vault-danger/5 text-sm font-bold text-vault-danger transition hover:bg-vault-danger/10"
              >
                Disable Security
              </button>
              <button
                type="button"
                onClick={state.lockVault}
                className="px-6 py-2.5 rounded-xl border border-vault-border bg-vault-card text-sm font-bold text-vault-text transition hover:bg-vault-elevated"
              >
                Lock Vault
              </button>
            </>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-vault-border">
          <Lock className="text-vault-secondary" size={20} />
          <h2 className="text-lg font-bold text-vault-text">General Preferences</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center justify-between p-4 rounded-xl border border-vault-border bg-vault-card group transition-colors hover:border-vault-primary/30">
            <div className="space-y-1">
              <p className="text-sm font-bold text-vault-text">External Tabs</p>
              <p className="text-xs text-vault-muted">Open links in a new browser tab</p>
            </div>
            <input
              type="checkbox"
              checked={state.settings.openInExternalBrowser}
              onChange={(e) => void state.updateSetting("openInExternalBrowser", e.target.checked)}
              className="h-5 w-5 rounded border-vault-border bg-vault-elevated text-vault-primary focus:ring-offset-vault-background"
            />
          </label>

          <button
            type="button"
            onClick={async () => {
              const granted = await ensureNotificationPermission();
              await state.updateSetting("notificationsEnabled", granted);
            }}
            className="flex items-center justify-between p-4 rounded-xl border border-vault-border bg-vault-card text-left transition-colors hover:border-vault-primary/30"
          >
            <div className="space-y-1">
              <p className="text-sm font-bold text-vault-text">Notifications</p>
              <p className="text-xs text-vault-muted">
                {isNotificationSupported()
                  ? state.settings.notificationsEnabled ? "Currently enabled" : "Disabled (Click to enable)"
                  : "Not supported by your browser"}
              </p>
            </div>
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-vault-border">
          <Upload className="text-vault-success" size={20} />
          <h2 className="text-lg font-bold text-vault-text">Data & Backups</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-vault-text">Export Vault</h3>
            <p className="text-xs text-vault-muted">Download a snapshot of your data. Encrypted backups require a password.</p>
            <input
              type="password"
              value={backupPassword}
              onChange={(e) => setBackupPassword(e.target.value)}
              placeholder="Backup password (optional)"
              className="w-full h-11 px-4 rounded-xl border border-vault-border bg-vault-card text-sm outline-none focus:border-vault-primary/50 transition-all"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => state.exportVault()}
                className="flex-1 px-4 py-2.5 rounded-xl border border-vault-border bg-vault-card text-xs font-bold text-vault-text hover:bg-vault-elevated transition"
              >
                JSON Export
              </button>
              <button
                type="button"
                onClick={() => state.exportVault({ encrypted: true, password: backupPassword })}
                className="flex-1 px-4 py-2.5 rounded-xl bg-vault-primary text-xs font-bold text-white shadow-subtle transition hover:opacity-90"
              >
                Encrypted Backup
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-vault-text">Import Vault</h3>
            <p className="text-xs text-vault-muted">Restore data from a backup file (.json).</p>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
              className="w-full text-xs text-vault-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-vault-elevated file:text-vault-text hover:file:bg-vault-border cursor-pointer"
            />
            <div className="flex gap-2">
              <select
                value={importMode}
                onChange={(e) => setImportMode(e.target.value as "merge" | "replace")}
                className="flex-1 px-3 py-2.5 rounded-xl border border-vault-border bg-vault-card text-xs font-bold text-vault-text outline-none"
              >
                <option value="merge">Merge Links</option>
                <option value="replace">Wipe & Replace</option>
              </select>
              <button
                type="button"
                disabled={!importFile || importing}
                onClick={() => void handleImport()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-vault-elevated text-xs font-bold text-vault-text border border-vault-border transition hover:bg-vault-card disabled:opacity-50"
              >
                {importing ? "Importing..." : "Start Import"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-vault-border">
          <Smartphone className="text-vault-primary" size={20} />
          <h2 className="text-lg font-bold text-vault-text">Mobile App</h2>
        </div>

        <div className="p-6 rounded-2xl border border-vault-border bg-vault-card/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-base font-bold text-vault-text">Vault X for Android</h3>
            <p className="text-sm text-vault-muted max-w-sm">Take your vault on the go. Synchronize your links, categories, and reminders across all your devices.</p>
          </div>

          <a
            href="https://play.google.com/store/apps/details?id=com.vaultx.vault_x"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-black border border-white/10 hover:border-vault-primary/50 hover:bg-zinc-900 transition-all shadow-subtle active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.609 2.091C3.411 2.296 3.297 2.607 3.297 3.003V20.997C3.297 21.393 3.411 21.704 3.609 21.909L3.673 21.965L13.167 12.471V12.316L3.673 2.822L3.609 2.091Z" fill="#EA4335" />
              <path d="M16.331 15.635L13.166 12.471V12.316L16.332 9.151L16.406 9.194L20.151 11.321C21.221 11.928 21.221 12.91 20.151 13.518L16.406 15.644L16.331 15.635Z" fill="#FBBC04" />
              <path d="M16.406 15.645L13.167 12.406L3.609 21.964C3.939 22.31 4.475 22.348 5.088 22.001L16.406 15.645Z" fill="#34A853" />
              <path d="M16.406 9.194L5.088 2.784C4.475 2.437 3.939 2.475 3.609 2.821L13.167 12.378L16.406 9.194Z" fill="#4285F4" />
            </svg>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] uppercase font-bold text-zinc-400 group-hover:text-zinc-300 transition-colors">Get it on</span>
              <span className="text-lg font-bold text-white mt-1">Google Play</span>
            </div>
          </a>
        </div>
      </section>

      <section className="p-6 rounded-2xl border border-vault-danger/20 bg-vault-danger/[0.02]">
        <h2 className="text-lg font-bold text-vault-danger">Danger Zone</h2>
        <p className="mt-1 text-sm text-vault-muted">Resetting the vault clears all links and custom data. This cannot be undone.</p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("CRITICAL: Wipe all vault data? This action is permanent.")) {
              void state.resetVault();
            }
          }}
          className="mt-4 px-6 py-2.5 rounded-xl border border-vault-danger/30 bg-vault-danger/10 text-sm font-bold text-vault-danger transition hover:bg-vault-danger/20"
        >
          Reset Vault
        </button>
      </section>
    </div>
  );
}
