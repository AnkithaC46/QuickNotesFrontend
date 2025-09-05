// src/components/NoteList.jsx
import React from "react";

export function NoteList({ notes, onSelect, onEdit, onDelete, onShare, selectedNoteId }) {
  return (
    <div className="space-y-3">
      {notes.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          <p className="mb-2">No notes yet.</p>
          <p>Click "New Note" to create your first one!</p>
        </div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className={`
              p-4 bg-gray-800 rounded-lg shadow-md transition-all duration-200
              hover:bg-gray-700 hover:shadow-xl cursor-pointer
              ${selectedNoteId === note.id ? "border-l-4 border-indigo-500 bg-gray-700" : "border-l-4 border-transparent"}
            `}
            onClick={() => onSelect(note)}
          >
            <h3 className="font-semibold text-lg text-indigo-300 truncate mb-1">
              {note.title || "Untitled Note"}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">{note.content}</p>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(note); }}
                className="px-3 py-1 bg-gray-700 hover:bg-indigo-600 text-gray-200 rounded-md transition"
                title="Edit Note"
              >
                Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded-md transition"
                title="Delete Note"
              >
                Delete
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await onShare(note.id);
                }}
                className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-md transition"
                title="Share Note"
              >
                Share
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}