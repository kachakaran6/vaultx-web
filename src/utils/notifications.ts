export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function showVaultNotification(title: string, body: string): boolean {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return false;
  }

  const notification = new Notification(title, {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: `vaultx-${title}`
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  return true;
}
