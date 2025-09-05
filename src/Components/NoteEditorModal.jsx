// src/components/NoteEditorModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function NoteEditorModal({ initial = { title: "", content: "" }, onSave, onClose, isOpen, saving }) {
  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);

  useEffect(() => {
    if (isOpen) {
      setTitle(initial.title || "");
      setContent(initial.content || "");
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      alert("Note cannot be empty!");
      return;
    }
    await onSave({ title: title.trim(), content: content.trim() });
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-lg border border-gray-700 animate-scale-in">
        <h2 className="text-2xl font-bold text-indigo-400 mb-6">{initial.id ? "Edit Note" : "Create New Note"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title (Optional)"
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-900 text-gray-100 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            autoFocus
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            rows="8"
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-900 text-gray-100 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y transition"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-600 rounded-md text-gray-200 hover:bg-gray-700 transition"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || (!title.trim() && !content.trim())}
              className={`
                px-5 py-2 rounded-md text-white transition
                ${saving ? "bg-indigo-700 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
              `}
            >
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}