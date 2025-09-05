// src/components/ToastContainer.jsx
import React from "react";
import { createPortal } from "react-dom";
import { Toast } from "./Toast"; // Assuming Toast is in the same folder

export const ToastContainer = ({ toasts, removeToast }) => {
  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>,
    document.body
  );
};