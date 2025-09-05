// src/hooks/useSharedNote.jsx
import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "https://quicknotess.onrender.com/api/v1.0/notes";

export function useSharedNote(addToast) {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSharedNote = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    setNote(null); // Clear previous note content before new fetch
    try {
      const res = await fetch(`${API_BASE_URL}/shared/${token}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to load shared note: ${errorText || res.statusText}`);
      }
      const data = await res.json();
      setNote(data);
      return data;
    } catch (e) {
      setError(e.message);
      addToast(e.message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, [addToast]); // addToast is a dependency

  return { note, loading, error, fetchSharedNote };
}