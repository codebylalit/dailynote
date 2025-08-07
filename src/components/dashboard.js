import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

// Add custom styles for animations
const toastStyles = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.2s ease-out;
  }
`;

const Dashboard = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    noteId: null,
    noteTitle: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
    initializeSpeechRecognition();
  }, [user]);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setToast({
          show: true,
          message: "Listening... Speak now!",
          type: "info"
        });
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setNewNote(prev => ({
            ...prev,
            content: prev.content + ' ' + finalTranscript
          }));
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setToast({
          show: true,
          message: "Voice recognition error. Please try again.",
          type: "error"
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognition);
    }
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
    } else {
      setToast({
        show: true,
        message: "Voice recognition not supported in this browser.",
        type: "error"
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      if (user) {
        // Fetch from Firebase if user is authenticated
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
      } else {
        // Fetch from localStorage if no user
        const storedNotes = localStorage.getItem("notes");
        if (storedNotes) {
          const notesData = JSON.parse(storedNotes);
          setNotes(notesData);
        }
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveNotesToStorage = (notesToSave) => {
    try {
      localStorage.setItem("notes", JSON.stringify(notesToSave));
    } catch (error) {
      console.error("Error saving notes:", error);
      setError("Failed to save notes. Please try again.");
    }
  };

  const addNote = async (e) => {
    e.preventDefault();

    if (!newNote.title.trim() || !newNote.content.trim()) {
      setError("Please fill in both title and content");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const noteData = {
        title: newNote.title.trim(),
        content: newNote.content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let newNoteWithId;

      if (user) {
        // Save to Firebase if user is authenticated
        noteData.userId = user.uid;
        const docRef = await addDoc(collection(db, "notes"), noteData);
        newNoteWithId = { id: docRef.id, ...noteData };
        setNotes((prevNotes) => [newNoteWithId, ...prevNotes]);
      } else {
        // Save to localStorage if no user
        newNoteWithId = { id: Date.now().toString(), ...noteData };
        const updatedNotes = [newNoteWithId, ...notes];
        setNotes(updatedNotes);
        saveNotesToStorage(updatedNotes);
      }
      
      setNewNote({ title: "", content: "" });
      setShowNoteForm(false);
      setSelectedNote(newNoteWithId);
      setToast({
        show: true,
        message: "Note created successfully!",
        type: "success",
      });

      setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Failed to create note. Please try again.");
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

      const updatedData = {
        title: editingNote.title.trim(),
        content: editingNote.content.trim(),
        updatedAt: new Date().toISOString(),
      };

      if (user) {
        // Update in Firebase if user is authenticated
        const noteRef = doc(db, "notes", editingNote.id);
        await updateDoc(noteRef, updatedData);
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editingNote.id ? { ...note, ...updatedData } : note
          )
        );
      } else {
        // Update in localStorage if no user
        const updatedNotes = notes.map((note) =>
          note.id === editingNote.id ? { ...note, ...updatedData } : note
        );
        setNotes(updatedNotes);
        saveNotesToStorage(updatedNotes);
      }

      setSelectedNote({ ...editingNote, ...updatedData });
      setEditingNote(null);
      setToast({
        show: true,
        message: "Note updated successfully!",
        type: "success",
      });

      setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Failed to update note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      if (user) {
        // Delete from Firebase if user is authenticated
        await deleteDoc(doc(db, "notes", id));
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
      } else {
        // Delete from localStorage if no user
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
        saveNotesToStorage(updatedNotes);
      }
      
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
      
      setToast({
        show: true,
        message: "Note deleted successfully!",
        type: "success",
      });

      setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note. Please try again.");
    }
  };

  const showDeleteModal = (noteId, noteTitle) => {
    setDeleteModal({
      show: true,
      noteId,
      noteTitle,
    });
  };

  const hideDeleteModal = () => {
    setDeleteModal({
      show: false,
      noteId: null,
      noteTitle: "",
    });
  };

  const confirmDelete = () => {
    deleteNote(deleteModal.noteId);
    hideDeleteModal();
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <style>{`
  @keyframes pulseBadge {
    0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.7); }
    70% { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
    100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
  }
  .pulse-badge {
    animation: pulseBadge 2s infinite;
  }
  @keyframes pulseBadgeYellow {
    0% { box-shadow: 0 0 0 0 rgba(234,179,8,0.7); }
    70% { box-shadow: 0 0 0 10px rgba(234,179,8,0); }
    100% { box-shadow: 0 0 0 0 rgba(234,179,8,0); }
  }
  .pulse-badge-yellow {
    animation: pulseBadgeYellow 2s infinite;
  }
`}</style>
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-6 md:py-8 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Notes</h1>
            {!user && (
              <div className="flex items-center px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-yellow-400 text-base font-medium">Local Storage</span>
              </div>
            )}
            {user && (
              <div className="flex items-center px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span className="text-blue-400 text-base font-medium">Cloud Sync</span>
              </div>
            )}
            <button
              onClick={() => setShowNoteForm(true)}
              className="bg-yellow-500 text-gray-900 px-5 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center space-x-2 text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>New Note</span>
            </button>
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-72 px-5 py-2 pl-12 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 text-base shadow-sm"
              />
              <svg className="w-5 h-5 absolute left-4 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            {user && (
              <div className="flex items-center space-x-3">
                <span className="text-gray-300 text-base font-medium truncate max-w-[120px] md:max-w-none">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                  title="Sign Out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                </button>
              </div>
            )}
            {!user && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-base">Want cloud sync?</span>
                <button
                  onClick={() => navigate("/register")}
                  className="text-yellow-500 hover:text-yellow-400 transition-colors duration-200 text-base font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-96 bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0 transition-all duration-300">
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">No notes yet</h3>
                <p className="text-gray-400 text-base">Create your first note to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`p-5 rounded-xl cursor-pointer transition-colors duration-200 shadow-sm border-2 ${
                      selectedNote?.id === note.id
                        ? "bg-yellow-500/20 border-yellow-500/70"
                        : "hover:bg-gray-700 border-transparent"
                    }`}
                  >
                    <h3 className="font-semibold text-lg text-white mb-1 truncate">
                      {note.title}
                    </h3>
                    <p className="text-base text-gray-300 mb-2 line-clamp-2">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatDate(note.updatedAt || note.createdAt)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showDeleteModal(note.id, note.title);
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 bg-gray-900 overflow-y-auto p-6 md:p-10 flex flex-col">
          {selectedNote ? (
            <div className="h-full flex flex-col">
              <div className="pb-6 border-b border-gray-700 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 md:gap-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {selectedNote.title}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setEditingNote(selectedNote)}
                      className="text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => showDeleteModal(selectedNote.id, selectedNote.title)}
                      className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-base text-gray-400">
                  Last modified: {formatDate(selectedNote.updatedAt || selectedNote.createdAt)}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap text-lg leading-relaxed">
                    {selectedNote.content}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Select a note
                </h3>
                <p className="text-gray-400 text-base">
                  Choose a note from the sidebar to view its contents
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Note Modal */}
      {showNoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Create New Note</h2>
            </div>
            <form onSubmit={addNote} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter note title..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content
                  </label>
                  <div className="relative">
                    <textarea
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                      rows="8"
                      placeholder="Enter note content or use voice input..."
                      required
                    />
                    <div className="absolute bottom-3 right-3 flex space-x-2">
                      {isListening ? (
                        <button
                          type="button"
                          onClick={stopListening}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                          title="Stop Recording"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={startListening}
                          className="p-2 bg-yellow-500 text-gray-900 rounded-full hover:bg-yellow-600 transition-colors duration-200"
                          title="Start Voice Input"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNoteForm(false)}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors duration-200 disabled:opacity-50 font-semibold text-sm"
                >
                  {saving ? "Creating..." : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Edit Note</h2>
            </div>
            <form onSubmit={updateNote} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter note title..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                    rows="8"
                    placeholder="Enter note content..."
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors duration-200 disabled:opacity-50 font-semibold text-sm"
                >
                  {saving ? "Updating..." : "Update Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Delete Note
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{deleteModal.noteTitle}"? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={hideDeleteModal}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 animate-slide-in ${
          toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"
        } text-white px-6 py-3 rounded-lg shadow-lg text-sm`}>
          {toast.message}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 left-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
