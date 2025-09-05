// src/hooks/useToasts.jsx
import { useState, useCallback } from "react";

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  return { toasts, addToast, removeToast };
}