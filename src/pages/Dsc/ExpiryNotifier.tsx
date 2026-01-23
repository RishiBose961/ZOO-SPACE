import { useEffect, useCallback } from "react";

interface ExpiryNotifierProps {
  expirydate: string;
}

const ExpiryNotifier: React.FC<ExpiryNotifierProps> = ({ expirydate }) => {
  const setupExpiryNotifications = useCallback(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const expiryTime = new Date(expirydate).getTime();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    const reminderStartTime = expiryTime - SEVEN_DAYS;
    const now = Date.now();

    let timeoutId: number | undefined;

    const FIRST_NOTIFY_KEY = `expiry_first_notified_${expirydate}`;

    // 🔍 Clean localStorage if older than 24 hours
    const stored = localStorage.getItem(FIRST_NOTIFY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (now - parsed.notifiedAt > TWENTY_FOUR_HOURS) {
          localStorage.removeItem(FIRST_NOTIFY_KEY);
        }
      } catch {
        localStorage.removeItem(FIRST_NOTIFY_KEY);
      }
    }

    const showNotification = () => {
      if (Date.now() >= expiryTime) return;
      if (localStorage.getItem(FIRST_NOTIFY_KEY)) return;

      new Notification("⏰ Expiry Reminder", {
        body: `Your DSC expires on ${expirydate}`,
      });

      // 💾 Store expiry + timestamp
      localStorage.setItem(
        FIRST_NOTIFY_KEY,
        JSON.stringify({
          expirydate,
          notifiedAt: Date.now(),
        })
      );
    };

    if (now >= reminderStartTime) {
      showNotification();
    } else {
      timeoutId = window.setTimeout(
        showNotification,
        reminderStartTime - now
      );
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [expirydate]);

  useEffect(() => {
    const cleanup = setupExpiryNotifications();
    return cleanup;
  }, [setupExpiryNotifications]);

  return null;
};

export default ExpiryNotifier;
