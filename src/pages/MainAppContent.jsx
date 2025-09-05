// src/pages/MainAppContent.jsx
import React, { useState } from "react";
import { useNotes } from "../hooks/useNotes";
import { useToasts } from "../hooks/useToasts";
import { NoteList } from "../Components/NoteList";
import { NoteEditorModal } from "../Components/NoteEditorModal";
import { ConfirmationModal } from "../Components/ConfirmationModal";
import { Spinner } from "../Components/Spinner";
import { ToastContainer } from "../Components/ToastContainer";

export function MainAppContent() {
  const { toasts, addToast, removeToast } = useToasts();
  const { notes, loading, error, fetchNotes, createNote, updateNote, deleteNote, shareNote } = useNotes(addToast);

  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [query, setQuery] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState(null);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const filteredNotes = notes.filter((n) => {
    const q = query.toLowerCase();
    return !q || (n.title && n.title.toLowerCase().includes(q)) || (n.content && n.content.toLowerCase().includes(q));
  });

  const handleOpenCreate = () => {
    setNoteToEdit(null);
    setSelectedNote(null);
    setIsEditorModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setNoteToEdit(note);
    setIsEditorModalOpen(true);
  };

  const handleCreateOrUpdateNote = async (noteData) => {
    setIsSavingNote(true);
    try {
      if (noteToEdit) {
        await updateNote(noteToEdit.id, noteData);
        setSelectedNote((prev) => (prev && prev.id === noteToEdit.id ? { ...prev, ...noteData } : prev));
      } else {
        const newNote = await createNote(noteData);
        setSelectedNote(newNote);
      }
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setIsSavingNote(false);
      setIsEditorModalOpen(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setNoteToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (noteToDeleteId) {
      try {
        await deleteNote(noteToDeleteId);
        if (selectedNote && selectedNote.id === noteToDeleteId) {
          setSelectedNote(null);
        }
      } catch (e) {
        console.error("Delete error:", e);
      } finally {
        setIsConfirmModalOpen(false);
        setNoteToDeleteId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setNoteToDeleteId(null);
  };

  const handleShare = async (id) => {
    try {
      await shareNote(id);
    } catch (e) {
      console.error("Share error:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
            <h1 className="text-4xl font-extrabold text-indigo-400">QuickNotes</h1>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
              title="Create New Note"
            >
              + New Note
            </button>
          </div>

          <div className="mb-6">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full p-3 rounded-md border border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {loading ? (
            <Spinner />
          ) : error ? (
            <div className="text-red-400 text-center py-4">{error}</div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <NoteList
                notes={filteredNotes}
                onSelect={setSelectedNote}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteRequest}
                onShare={handleShare}
                selectedNoteId={selectedNote?.id}
              />
            </div>
          )}

          <div className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-700 text-center">
            Total Notes: {notes.length}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 min-h-[500px] flex flex-col">
          {selectedNote ? (
            <>
              <div className="flex justify-between items-start pb-6 border-b border-gray-700 mb-6">
                <div>
                  <h2 className="text-4xl font-bold text-indigo-300 mb-2 break-words">{selectedNote.title || "Untitled Note"}</h2>
                  <p className="text-sm text-gray-500">Note ID: {selectedNote.id}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleOpenEdit(selectedNote)}
                    className="px-4 py-2 border border-gray-600 rounded-md text-gray-200 hover:bg-gray-700 transition flex items-center gap-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(selectedNote.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition flex items-center gap-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto text-lg text-gray-300 whitespace-pre-wrap leading-relaxed custom-scrollbar pr-2">
                {selectedNote.content}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 p-6">
              <p className="text-xl font-medium mb-4">Welcome to QuickNotes!</p>
              <p className="max-w-md">
                Select a note from the list on the left to view it, or click "New Note" to create your first one.
              </p>
              <button
                onClick={handleOpenCreate}
                className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-lg font-semibold"
              >
                Start Writing Now!
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-700 flex justify-end gap-3">
            <button
              onClick={() => fetchNotes()}
              className="px-4 py-2 border border-gray-600 rounded-md text-gray-200 hover:bg-gray-700 transition"
            >
              Refresh Notes
            </button>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
              Quick Add
            </button>
          </div>
        </div>
      </div>

      <NoteEditorModal
        isOpen={isEditorModalOpen}
        initial={noteToEdit || { title: "", content: "" }}
        onSave={handleCreateOrUpdateNote}
        onClose={() => setIsEditorModalOpen(false)}
        saving={isSavingNote}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Tailwind CSS Custom Scrollbar & Animation Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151; /* gray-700 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6366f1; /* indigo-500 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4f46e5; /* indigo-600 */
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}