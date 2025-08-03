import React, { useState, useEffect } from "react";
import {
  db,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "../firebase";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user || !user.uid) {
        setError("Authentication error. Please sign in again.");
        return;
      }

      console.log("Fetching notes for user:", user.uid);
      const notesQuery = query(
        collection(db, "notes"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const notesSnapshot = await getDocs(notesQuery);
      const notesData = notesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    } catch (error) {
      console.error("Error fetching notes:", error);

      // Provide more specific error messages
      if (error.code === "permission-denied") {
        setError(
          "Permission denied. Please check your Firestore security rules."
        );
      } else if (error.code === "unauthenticated") {
        setError("Authentication error. Please sign in again.");
      } else if (error.code === "not-found") {
        setError(
          "Database not found. Please check your Firebase configuration."
        );
      } else {
        setError(`Failed to load notes: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();

    if (!newNote.title.trim() || !newNote.content.trim()) {
      setError("Please fill in both title and content");
      return;
    }

    // Check if user is authenticated
    if (!user || !user.uid) {
      setError("Authentication error. Please sign in again.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const noteData = {
        title: newNote.title.trim(),
        content: newNote.content.trim(),
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Attempting to add note with data:", noteData);
      const docRef = await addDoc(collection(db, "notes"), noteData);
      const newNoteWithId = { id: docRef.id, ...noteData };

      setNotes((prevNotes) => [newNoteWithId, ...prevNotes]);
      setNewNote({ title: "", content: "" });
      setShowNoteForm(false);
      setSuccess("Note created successfully!");

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error adding note:", error);

      // Provide more specific error messages
      if (error.code === "permission-denied") {
        setError(
          "Permission denied. Please check your Firestore security rules."
        );
      } else if (error.code === "unauthenticated") {
        setError("Authentication error. Please sign in again.");
      } else if (error.code === "not-found") {
        setError(
          "Database not found. Please check your Firebase configuration."
        );
      } else {
        setError(`Failed to create note: ${error.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const updateNote = async (e) => {
    e.preventDefault();

    if (!editingNote.title.trim() || !editingNote.content.trim()) {
      setError("Please fill in both title and content");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const noteRef = doc(db, "notes", editingNote.id);
      const updatedData = {
        title: editingNote.title.trim(),
        content: editingNote.content.trim(),
        updatedAt: new Date(),
      };

      await updateDoc(noteRef, updatedData);

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editingNote.id ? { ...note, ...updatedData } : note
        )
      );

      setEditingNote(null);
      setSuccess("Note updated successfully!");

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Failed to update note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "notes", id));
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      setSuccess("Note deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            {/* Animated logo with float and glow effects */}
            <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-6 animate-float animate-glow">
              <span className="text-white font-bold text-xl">DN</span>
            </div>

            {/* Loading dots with staggered animation */}
            <div className="flex justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>

            {/* Loading text with fade-in effect */}
            <h3 className="text-white text-xl font-semibold mb-2 animate-pulse">
              Loading your notes
            </h3>
            <p className="text-gray-400">
              Please wait while we fetch your data...
            </p>

            {/* Progress bar */}
            <div className="w-48 h-1 bg-gray-700 rounded-full mx-auto mt-4 overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DN</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DailyNote</h1>
                <p className="text-gray-300 text-sm">Welcome, {user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
            {success}
          </div>
        )}

        {/* Add Note Section */}
        <div className="mb-8">
          {!showNoteForm ? (
            <button
              onClick={() => setShowNoteForm(true)}
              className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-all duration-200 flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              <span>Add New Note</span>
            </button>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Create New Note
              </h2>
              <form onSubmit={addNote} className="space-y-4">
                <input
                  type="text"
                  placeholder="Note Title"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  className="w-full px-4 py-3 text-white bg-gray-800/50 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700 transition-all duration-200"
                  disabled={saving}
                />
                <textarea
                  placeholder="Write your note here..."
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                  className="w-full px-4 py-3 text-white bg-gray-800/50 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700 transition-all duration-200 resize-none"
                  rows="6"
                  disabled={saving}
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Creating..." : "Create Note"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNoteForm(false);
                      setNewNote({ title: "", content: "" });
                      setError("");
                    }}
                    className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No notes yet
              </h3>
              <p className="text-gray-400">
                Create your first note to get started!
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-200"
              >
                {editingNote?.id === note.id ? (
                  <form onSubmit={updateNote} className="space-y-4">
                    <input
                      type="text"
                      value={editingNote.title}
                      onChange={(e) =>
                        setEditingNote({
                          ...editingNote,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                      disabled={saving}
                    />
                    <textarea
                      value={editingNote.content}
                      onChange={(e) =>
                        setEditingNote({
                          ...editingNote,
                          content: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700 resize-none"
                      rows="4"
                      disabled={saving}
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 transition-all duration-200 disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingNote(null)}
                        className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white line-clamp-2">
                        {note.title}
                      </h3>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditingNote(note)}
                          className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                          title="Edit note"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            ></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete note"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 line-clamp-4 mb-4">
                      {note.content}
                    </p>
                    <div className="text-xs text-gray-400">
                      {formatDate(note.createdAt)}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
