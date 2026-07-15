import { useState, useRef } from "react";
import { useAppStore } from "../store/app-store";
import { pushToast } from "../store/toast-store";
import { ensureNotificationPermission, isNotificationSupported } from "../utils/notifications";
import { verifyPin } from "../utils/security";
import { AppearanceSettings } from "../components/settings/AppearanceSettings";
import { PageHeader } from "../components/ui/PageHeader";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { DuplicateResolverDialog } from "../components/DuplicateResolverDialog";
import { parseNetscapeHTML } from "../utils/export";

export function SettingsPage() {
  const state = useAppStore();
  const [pinCurrent, setPinCurrent] = useState("");
  const [pinNext, setPinNext] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinBusy, setPinBusy] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showDuplicateResolver, setShowDuplicateResolver] = useState(false);

  const [backupPassword, setBackupPassword] = useState("");
  const [exportType, setExportType] = useState<"plain" | "encrypted">("plain");
  
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPassword, setImportPassword] = useState("");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setShowPinSetup(false);
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
    setShowPinSetup(false);
    pushToast({ tone: "success", title: "PIN removed", description: "Security lock has been disabled." });
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    try {
      const text = await importFile.text();
      if (importFile.name.toLowerCase().endsWith(".html")) {
        const parsed = parseNetscapeHTML(text);
        let addedCount = 0;
        for (const draft of parsed) {
          const result = await state.saveLink({
            title: draft.title || "",
            url: draft.url || "",
            categoryId: "general",
            tags: draft.tags || [],
            notes: "",
            isFavorite: false
          });
          if (result.ok) {
            addedCount++;
          }
        }
        pushToast({ tone: "success", title: "Bookmarks imported", description: `Successfully imported ${addedCount} bookmarks.` });
      } else {
        await state.importVault(text, { mode: importMode, password: importPassword || undefined });
        pushToast({ tone: "success", title: "Data restored", description: "Collection imported successfully." });
      }
      setImportFile(null);
      setImportPassword("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      pushToast({ tone: "danger", title: "Import failed", description: "Could not decode archive file. Check password if encrypted." });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-2xl w-full pb-32">
      <div className="flex flex-col gap-8">
        
        {/* Appearance */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight text-text">Appearance</h3>
          <AppearanceSettings />
        </section>

        <Separator />

        {/* Interaction */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight text-text">Interaction</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-text">Open links externally</label>
                <p className="text-xs text-text-muted">Launch addresses in secondary tabs.</p>
              </div>
              <Switch 
                checked={state.settings.openInExternalBrowser}
                onCheckedChange={(c) => void state.updateSetting("openInExternalBrowser", c)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-text">Push notifications</label>
                <p className="text-xs text-text-muted">
                  {isNotificationSupported()
                    ? state.settings.notificationsEnabled ? "System alerts enabled." : "Receive push updates."
                    : "Not supported by browser."}
                </p>
              </div>
              <Switch 
                disabled={!isNotificationSupported()}
                checked={state.settings.notificationsEnabled}
                onCheckedChange={async (c) => {
                  const granted = c ? await ensureNotificationPermission() : false;
                  await state.updateSetting("notificationsEnabled", granted);
                }}
              />
            </div>
          </div>
        </section>

        <Separator />

        {/* Security */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight text-text flex items-center justify-between">
            Security
            {state.settings.pinEnabled && (
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={state.lockVault}>Lock Now</Button>
            )}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-text">PIN lock</label>
                <p className="text-xs text-text-muted">Require a PIN to access Vault X.</p>
              </div>
              <Switch 
                checked={state.settings.pinEnabled || showPinSetup}
                onCheckedChange={(c) => {
                  if (c) {
                    setShowPinSetup(true);
                  } else {
                    if (state.settings.pinEnabled) {
                      setShowPinSetup(true); // show to allow them to enter current pin to disable
                    } else {
                      setShowPinSetup(false);
                    }
                  }
                }}
              />
            </div>

            {showPinSetup && (
              <div className="bg-surface-2 rounded-lg p-4 space-y-4 border border-border animate-in fade-in zoom-in-95 duration-200">
                {state.settings.pinEnabled && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text uppercase tracking-wider">Current PIN</label>
                    <Input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={pinCurrent}
                      onChange={(e) => setPinCurrent(e.target.value.replace(/\D/g, ""))}
                      placeholder="Required to change or disable"
                      className="bg-surface"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text uppercase tracking-wider">New PIN</label>
                    <Input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={pinNext}
                      onChange={(e) => setPinNext(e.target.value.replace(/\D/g, ""))}
                      placeholder="4 digits"
                      className="bg-surface"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text uppercase tracking-wider">Confirm</label>
                    <Input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={pinConfirm}
                      onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ""))}
                      placeholder="Repeat"
                      className="bg-surface"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button 
                    disabled={pinBusy || pinNext.length !== 4 || pinNext !== pinConfirm}
                    onClick={() => void handlePinSave()}
                    className="flex-1"
                  >
                    Save PIN
                  </Button>
                  {state.settings.pinEnabled && (
                    <Button 
                      variant="destructive"
                      disabled={pinBusy || pinCurrent.length !== 4}
                      onClick={() => void handlePinDisable()}
                      className="flex-1"
                    >
                      Disable PIN
                    </Button>
                  )}
                  {!state.settings.pinEnabled && (
                    <Button 
                      variant="outline"
                      onClick={() => setShowPinSetup(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <Separator />

        {/* Data */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold tracking-tight text-text">Data</h3>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text">Export backup</h4>
            
            <div className="flex p-1 bg-surface-2 rounded-lg w-full max-w-sm">
              <button
                onClick={() => setExportType("plain")}
                className={`flex-1 h-8 rounded-md text-sm font-medium transition-all ${exportType === "plain" ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"}`}
              >
                Plain text
              </button>
              <button
                onClick={() => setExportType("encrypted")}
                className={`flex-1 h-8 rounded-md text-sm font-medium transition-all ${exportType === "encrypted" ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"}`}
              >
                Encrypted JSON
              </button>
            </div>

            {exportType === "encrypted" && (
              <Input
                type="password"
                value={backupPassword}
                onChange={(e) => setBackupPassword(e.target.value)}
                placeholder="Encryption passphrase"
                className="max-w-sm"
              />
            )}

            <Button 
              variant="outline" 
              onClick={() => {
                if (exportType === "encrypted") {
                  if (!backupPassword) {
                    pushToast({ tone: "warning", title: "Passphrase required", description: "Enter a password to encrypt backup." });
                    return;
                  }
                  state.exportVault({ encrypted: true, password: backupPassword });
                } else {
                  state.exportVault();
                }
              }}
            >
              <span className="material-symbols-outlined mr-2 text-[18px]">download</span>
              Download Backup
            </Button>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-semibold text-text">Import backup</h4>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.html"
                  onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                  className="max-w-xs cursor-pointer"
                />
                <select
                  value={importMode}
                  onChange={(e) => setImportMode(e.target.value as "merge" | "replace")}
                  className="h-9 px-3 rounded-md border border-border bg-surface text-sm font-medium text-text outline-none"
                >
                  <option value="merge">Merge with existing</option>
                  <option value="replace">Overwrite existing</option>
                </select>
              </div>

              {importFile && (
                <div className="animate-in fade-in duration-200">
                  <Input
                    type="password"
                    value={importPassword}
                    onChange={(e) => setImportPassword(e.target.value)}
                    placeholder="Decryption password (if encrypted)"
                    className="max-w-xs mb-3"
                  />
                  <Button 
                    disabled={!importFile || importing}
                    onClick={() => void handleImport()}
                  >
                    <span className="material-symbols-outlined mr-2 text-[18px]">upload</span>
                    {importing ? "Importing..." : "Restore Data"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        <Separator />
        
        {/* Database Maintenance Tools */}
        <section className="bg-surface border border-border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-text tracking-tight">Database Maintenance</h3>
            <p className="text-xs text-text-muted">Scan bookmarks for exact URL duplicates or identical titles to merge tags, notes, and visits.</p>
          </div>
          <Button 
            variant="outline" 
            className="shrink-0 w-full sm:w-auto"
            onClick={() => setShowDuplicateResolver(true)}
          >
            <span className="material-symbols-outlined mr-2 text-[18px]">find_replace</span>
            Resolve Duplicates
          </Button>
        </section>

        <Separator />
        
        {/* Danger Zone */}
        <section className="bg-danger/5 border border-danger/20 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-danger tracking-tight">Danger Zone</h3>
            <p className="text-xs text-danger/80">Permanently delete all stored data and reset. This action cannot be undone.</p>
          </div>
          <Button 
            variant="destructive" 
            className="shrink-0 w-full sm:w-auto"
            onClick={() => { 
              if (window.confirm("Permanently delete all stored data and reset? This action cannot be undone.")) { 
                void state.resetVault(); 
                pushToast({ tone: "success", title: "Vault cleared", description: "All local data destroyed." }); 
              } 
            }}
          >
            Reset Vault
          </Button>
        </section>

        <DuplicateResolverDialog
          open={showDuplicateResolver}
          onClose={() => setShowDuplicateResolver(false)}
        />

      </div>
    </div>
  );
}
