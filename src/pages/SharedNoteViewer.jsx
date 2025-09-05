// src/pages/SharedNoteViewer.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSharedNote } from "../hooks/useSharedNote"; // Import the dedicated hook
import { useToasts } from "../hooks/useToasts"; // Import useToasts for this component
import { Spinner } from "../Components/Spinner"; // Import Spinner

export function SharedNoteViewer() {
  const { token } = useParams();
  const { addToast } = useToasts(); // Get addToast for this component
  const { note, loading, error, fetchSharedNote } = useSharedNote(addToast); // Use the new hook

  useEffect(() => {
    if (token) {
      fetchSharedNote(token); // Call the fetch function from the new hook
    } else {
      addToast("No share token provided in the URL.", "error");
    }
  }, [token, fetchSharedNote, addToast]); // addToast is a dependency because useSharedNote uses it

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 w-full">
        <h1 className="text-center text-4xl font-extrabold text-indigo-400 mb-6">Shared Note</h1>

        {loading ? (
            <Spinner />
        ) : error ? (
            <div className="text-red-400 text-center text-lg">{error}</div>
        ) : note ? (
            <>
                <h2 className="text-3xl font-bold text-indigo-300 mb-4 break-words">{note.title || "Untitled Shared Note"}</h2>
                <hr className="my-6 border-gray-700" />
                <div className="text-lg text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </div>
            </>
        ) : (
            <div className="text-center text-gray-400 text-xl py-10">
                Note not found or the share link is invalid/expired.
            </div>
        )}

        <div className="mt-8 text-center text-gray-500">
            <p>This is a shared note view. You cannot edit it here.</p>
            <p className="text-sm mt-2">
                <a href="/" className="text-indigo-400 hover:text-indigo-300 underline">Go back to QuickNotes app</a>
            </p>
        </div>
      </div>
    </div>
  );
}