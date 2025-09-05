// src/components/Toast.jsx
import React, { useEffect } from "react";

export const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type || "info"];

  return (
    <div
      className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-between animate-fade-in-down`}
      role="alert"
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-lg font-bold">
        &times;
      </button>
    </div>
  );
};