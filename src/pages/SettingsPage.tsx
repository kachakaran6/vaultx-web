import { useState } from "react";
import { Download, KeyRound, Lock, ShieldCheck, Upload, Palette, Trash2, CheckCircle2, Info } from "lucide-react";
import { useAppStore } from "../store/app-store";
import { pushToast } from "../store/toast-store";
import { ensureNotificationPermission, isNotificationSupported } from "../utils/notifications";
import { verifyPin } from "../utils/security";
import { AppearanceSettings } from "../components/settings/AppearanceSettings";
import { Button } from "../components/ui/Button";

import { PageHeader } from "../components/ui/PageHeader";

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

  const handlePinSave = async () => {
    if (pinNext.length !== 4 || pinNext !== pinConfirm) {
      pushToast({ tone: "warning", title: "PIN mismatch", description: "Enter the same 4-digit PIN twice." });
      return;
    }
    setPinBusy(true);
    if (state.settings.pinEnabled && state.settings.pinHash) {
      const valid = await verifyPin(pinCurrent, state.settings.pinHash);
      if (!valid) {
        setPinBusy(false);
        pushToast({ tone: "warning", title: "Incorrect PIN", description: "Enter current PIN to update." });
        return;
      }
    }
    await state.setPin(pinNext);
    setPinBusy(false);
    setPinCurrent("");
    setPinNext("");
    setPinConfirm("");
    pushToast({ tone: "success", title: "PIN saved", description: "Security configuration updated." });
  };

  const handlePinDisable = async () => {
    if (state.settings.pinHash) {
      const valid = await verifyPin(pinCurrent, state.settings.pinHash);
      if (!valid) {
        pushToast({ tone: "warning", title: "Incorrect PIN", description: "Required to disable security." });
        return;
      }
    }
    await state.clearPin();
    setPinCurrent("");
    pushToast({ tone: "success", title: "PIN removed", description: "Security lock has been disabled." });
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    try {
      const text = await importFile.text();
      await state.importVault(text, { mode: importMode, password: importPassword || undefined });
      setImportFile(null);
      pushToast({ tone: "success", title: "Data restored", description: "Collection imported successfully." });
    } catch (error) {
      pushToast({ tone: "danger", title: "Import failed", description: "Could not decode archive file." });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-start">
        
        {/* PREFERENCE PANEL: APPEARANCE */}
        <section className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-border/50 flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Palette size={18} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-foreground">Appearance</h2>
              <p className="text-[12px] text-muted-foreground">Customize your user interface</p>
            </div>
          </div>
          <div className="p-6 flex-1">
            <AppearanceSettings />
          </div>
        </section>

        {/* PREFERENCE PANEL: FUNCTIONALITY */}
        <section className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-border/50 flex items-center gap-3">
            <div className="p-2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Lock size={18} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-foreground">Interaction</h2>
              <p className="text-[12px] text-muted-foreground">Control how links function</p>
            </div>
          </div>
          
          <div className="p-6 space-y-4 flex-1">
            <label className="flex items-start justify-between p-4 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 cursor-pointer transition-colors group">
              <div className="min-w-0 flex-1 pr-4">
                <span className="block text-[14px] font-semibold text-foreground mb-0.5">Open Links Externally</span>
                <span className="block text-[12px] text-muted-foreground">Launch addresses in secondary tabs instead of shell.</span>
              </div>
              <input
                type="checkbox"
                checked={state.settings.openInExternalBrowser}
                onChange={(e) => void state.updateSetting("openInExternalBrowser", e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>

            <button
              type="button"
              onClick={async () => {
                const granted = await ensureNotificationPermission();
                await state.updateSetting("notificationsEnabled", granted);
              }}
              className="w-full flex items-start justify-between p-4 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors text-left"
            >
              <div className="min-w-0 flex-1 pr-4">
                <span className="block text-[14px] font-semibold text-foreground mb-0.5">Notifications</span>
                <span className="block text-[12px] text-muted-foreground">
                  {isNotificationSupported()
                    ? state.settings.notificationsEnabled ? "Enabled — system alerts will trigger." : "Receive push updates for reminders."
                    : "Not supported by current browser environment."}
                </span>
              </div>
              <div className="mt-1">
                {state.settings.notificationsEnabled ? (
                  <CheckCircle2 className="text-emerald-500" size={18} />
                ) : (
                  <div className="w-4.5 h-4.5 rounded-full border-2 border-muted-foreground/30" />
                )}
              </div>
            </button>

            <div className="mt-auto pt-4">
              <div className="p-3 text-[12px] font-medium text-primary bg-primary/5 border border-primary/10 rounded-md flex gap-2">
                <Info size={16} className="shrink-0" />
                <span>Configurations are stored safely within your local browser storage.</span>
              </div>
            </div>
          </div>
        </section>

        {/* PREFERENCE PANEL: SECURITY PIN */}
        <section className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-border/50 flex items-center gap-3">
            <div className="p-2 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <KeyRound size={18} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-foreground">Security Lock</h2>
              <p className="text-[12px] text-muted-foreground">Block unwanted access with a PIN</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6 flex-1 flex flex-col">
            {state.settings.pinEnabled ? (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400">
                <div className="flex items-center gap-2 font-medium text-[13px]">
                  <ShieldCheck size={16} /> Access is locked
                </div>
                <button onClick={state.lockVault} className="px-2.5 py-1 text-[11px] font-bold uppercase bg-white dark:bg-zinc-800 rounded border border-emerald-200 dark:border-emerald-900 hover:shadow-sm">Lock Now</button>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-secondary border border-border flex items-center gap-2.5 text-muted-foreground text-[13px] font-medium">
                <Lock size={16} /> No security configured
              </div>
            )}

            <div className="grid gap-4">
              {state.settings.pinEnabled && (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-foreground">Current PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pinCurrent}
                    onChange={(e) => setPinCurrent(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-10 px-3 rounded-md border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Confirm current"
                  />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-foreground">New 4-Digit PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pinNext}
                    onChange={(e) => setPinNext(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-10 px-3 rounded-md border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="New PIN"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-foreground">Confirm PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pinConfirm}
                    onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-10 px-3 rounded-md border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Repeat PIN"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-auto pt-2">
              <Button
                className="flex-1"
                disabled={pinBusy || pinNext.length !== 4 || pinNext !== pinConfirm}
                onClick={() => void handlePinSave()}
              >
                Save PIN
              </Button>
              {state.settings.pinEnabled && (
                <Button 
                  variant="secondary" 
                  className="text-rose-600 hover:text-rose-700"
                  onClick={() => void handlePinDisable()}
                >
                  Disable
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* PREFERENCE PANEL: EXPORT/IMPORT */}
        <section className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-border/50 flex items-center gap-3">
            <div className="p-2 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Download size={18} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-foreground">Data Transfer</h2>
              <p className="text-[12px] text-muted-foreground">Backup or migrate collection databases</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6 flex-1">
            {/* Mini-Export Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground">Export Backup</h3>
              </div>
              <input
                type="password"
                value={backupPassword}
                onChange={(e) => setBackupPassword(e.target.value)}
                placeholder="Encryption passphrase (optional)"
                className="w-full h-9 px-3 rounded-md border border-border bg-secondary/50 text-sm placeholder:text-muted-foreground/60"
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => state.exportVault()}>Plain Text</Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={() => state.exportVault({ encrypted: true, password: backupPassword })}>Encrypted JSON</Button>
              </div>
            </div>

            <hr className="border-border/50" />

            {/* Mini-Import Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground">Import Archives</h3>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 min-w-0 border border-border rounded-md px-2 py-1.5 bg-secondary/50">
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                      className="block w-full text-[12px] text-muted-foreground file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-primary/10 file:text-primary cursor-pointer"
                    />
                  </div>
                  <select
                    value={importMode}
                    onChange={(e) => setImportMode(e.target.value as "merge" | "replace")}
                    className="h-[38px] px-2.5 rounded-md border border-border bg-card text-[13px] font-medium text-foreground outline-none shadow-sm"
                  >
                    <option value="merge">Merge</option>
                    <option value="replace">Overwrite</option>
                  </select>
                </div>
                <Button 
                  size="sm"
                  className="w-full"
                  disabled={!importFile || importing}
                  onClick={() => void handleImport()}
                  leftIcon={<Upload size={14} />}
                >
                  {importing ? "Reading..." : "Load Archive"}
                </Button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Divider separating primary settings from utilities */}
      <hr className="border-border/50 my-2" />

      {/* Utility Footer Row: High-Density Low Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* MOBILE COMPANION - Compact version */}
        <section className="bg-card border border-border rounded-lg shadow-sm p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-[13px] font-bold text-foreground">Mobile App</h3>
              <span className="px-1 py-0.25 rounded bg-primary/10 text-primary text-[9px] font-bold font-mono">V1.1.0</span>
            </div>
            <p className="text-[12px] text-muted-foreground truncate">Android native companion</p>
          </div>
          <a 
            href="https://play.google.com/store/apps/details?id=com.vaultx.vault_x" 
            target="_blank" 
            rel="noopener noreferrer"
            className="shrink-0 h-9 px-3 bg-zinc-900 text-white rounded-md flex items-center gap-2 hover:bg-black transition-colors border border-zinc-700"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <path d="M3.609 2.091C3.411 2.296 3.297 2.607 3.297 3.003V20.997C3.297 21.393 3.411 21.704 3.609 21.909L3.673 21.965L13.167 12.471V12.316L3.673 2.822L3.609 2.091Z" fill="#EA4335" />
              <path d="M16.331 15.635L13.166 12.471V12.316L16.332 9.151L16.406 9.194L20.151 11.321C21.221 11.928 21.221 12.91 20.151 13.518L16.406 15.644L16.331 15.635Z" fill="#FBBC04" />
              <path d="M16.406 15.645L13.167 12.406L3.609 21.964C3.939 22.31 4.475 22.348 5.088 22.001L16.406 15.645Z" fill="#34A853" />
              <path d="M16.406 9.194L5.088 2.784C4.475 2.437 3.939 2.475 3.609 2.821L13.167 12.378L16.406 9.194Z" fill="#4285F4" />
            </svg>
            <span className="text-[11px] font-bold">Play Store</span>
          </a>
        </section>

        {/* DESTRUCTIVE ZONE - Compact version */}
        <section className="bg-rose-50/40 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/30 rounded-lg p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-[13px] font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <Trash2 size={14} /> Danger Zone
            </h3>
            <p className="text-[11px] text-rose-700/70 dark:text-rose-400/60 mt-0.5 truncate">Purge all local stored data.</p>
          </div>
          <button
            type="button"
            onClick={() => { if (window.confirm("Permanently delete all stored data and reset? This action cannot be undone.")) { void state.resetVault(); pushToast({ tone: "success", title: "Vault cleared", description: "All local data destroyed." }); } }}
            className="shrink-0 h-9 px-3 bg-white dark:bg-zinc-900 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-md text-[11px] font-bold hover:bg-rose-600 hover:text-white transition-colors whitespace-nowrap"
          >
            Reset Vault
          </button>
        </section>

      </div>
    </div>
  );
}

