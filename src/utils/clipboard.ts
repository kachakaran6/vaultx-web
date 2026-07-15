import { pushToast } from "../store/toast-store";

let autoClearTimeout: ReturnType<typeof setTimeout> | null = null;

export async function copyPasswordAndScheduleClear(password: string) {
  try {
    await navigator.clipboard.writeText(password);
    pushToast({
      tone: "success",
      title: "Password copied",
      description: "Clipboard will be auto-cleared in 30 seconds for security."
    });

    if (autoClearTimeout) {
      clearTimeout(autoClearTimeout);
    }

    autoClearTimeout = setTimeout(async () => {
      try {
        const currentText = await navigator.clipboard.readText();
        if (currentText === password) {
          await navigator.clipboard.writeText("");
          pushToast({
            tone: "warning",
            title: "Clipboard cleared",
            description: "Copied password was automatically cleared."
          });
        }
      } catch (err) {
        // If permission is denied or window not focused, clear anyway
        await navigator.clipboard.writeText("");
        pushToast({
          tone: "warning",
          title: "Clipboard cleared",
          description: "Copied password was automatically cleared."
        });
      }
    }, 30000);
  } catch (err) {
    pushToast({
      tone: "danger",
      title: "Copy failed",
      description: "Could not write password to clipboard."
    });
  }
}
