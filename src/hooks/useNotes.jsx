// src/hooks/useNotes.jsx
import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "https://quicknotess.onrender.com/api/v1.0/notes";

export function useNotes(addToast) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch notes: ${errorText || res.statusText}`);
      }
      const data = await res.json();
      setNotes(data);
    } catch (e) {
      setError(e.message);
      addToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const createNote = async (note) => {
    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create note: ${errorText || res.statusText}`);
      }
      const created = await res.json();
      setNotes((s) => [created, ...s]);
      addToast("Note created successfully!", "success");
      return created;
    } catch (e) {
      addToast(e.message, "error");
      throw e;
    }
  };

  const updateNote = async (id, note) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update note: ${errorText || res.statusText}`);
      }
      const updated = await res.json();
      setNotes((s) => s.map((n) => (n.id === id ? updated : n)));
      addToast("Note updated successfully!", "success");
      return updated;
    } catch (e) {
      addToast(e.message, "error");
      throw e;
    }
  };

  const deleteNote = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete note: ${errorText || res.statusText}`);
      }
      setNotes((s) => s.filter((n) => n.id !== id));
      addToast("Note deleted successfully!", "success");
    } catch (e) {
      addToast(e.message, "error");
      throw e;
    }
  };

  const shareNote = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/share`, { method: "POST" });
      if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to share note: ${errorText || res.statusText}`);
      }
      const token = await res.text();
      if (!token || typeof token !== 'string' || token.length < 10) {
          throw new Error("Invalid token received from backend.");
      }
      const shareLink = `${window.location.origin}/shared/${token}`;
      await navigator.clipboard.writeText(shareLink);
      addToast("Note link copied to clipboard!", "success");
      return shareLink;
    } catch (e) {
      addToast(e.message || "Failed to share note", "error");
      throw e;
    }
  };

  // This useEffect only runs for the main app, not for shared notes
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, loading, error, fetchNotes, createNote, updateNote, deleteNote, shareNote };
}