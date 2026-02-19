import React, { useEffect, useRef, useState } from "react";
import { TOAST_EVENT } from "../utils/toast";
import "../styles/Toast.css";

const TOAST_DURATION = 3500;

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  const timeoutIds = useRef(new Map());

  useEffect(() => {
    const removeToast = (id) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      const timer = timeoutIds.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timeoutIds.current.delete(id);
      }
    };

    const onToast = (event) => {
      const incoming = event?.detail;
      if (!incoming?.id || !incoming?.message) return;

      setToasts((prev) => [...prev, incoming].slice(-4));
      const timer = setTimeout(() => removeToast(incoming.id), TOAST_DURATION);
      timeoutIds.current.set(incoming.id, timer);
    };

    window.addEventListener(TOAST_EVENT, onToast);

    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      timeoutIds.current.forEach((timer) => clearTimeout(timer));
      timeoutIds.current.clear();
    };
  }, []);

  const closeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = timeoutIds.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timeoutIds.current.delete(id);
    }
  };

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type === "success" ? "success" : "error"}`}
          role="status"
        >
          <span className="toast__message">{toast.message}</span>
          <button
            className="toast__close"
            type="button"
            onClick={() => closeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
