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
} from "../firebase";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState(null);
  const [user, setUser] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const notesQuery = query(
            collection(db, "notes"),
            where("userId", "==", userId)
          );
          const notesSnapshot = await getDocs(notesQuery);
          if (!notesSnapshot.empty) {
            setNotes(
              notesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
          }
          setUser(auth.currentUser);
        }
      } catch (error) {
        console.error("Error fetching notes:", error.message);
      }
    };

    fetchNotes();
  }, []);

  const addNote = async () => {
    try {
      if (newNote.title && newNote.content && auth.currentUser) {
        const userId = auth.currentUser.uid;
        const note = { title: newNote.title, content: newNote.content, userId };
        const docRef = await addDoc(collection(db, "notes"), note);
        setNotes((prevNotes) => [...prevNotes, { id: docRef.id, ...note }]);
        setNewNote({ title: "", content: "" });
      }
    } catch (error) {
      console.error("Error adding note:", error.message);
    }
  };

  const updateNote = async () => {
    if (editingNote) {
      const noteRef = doc(db, "notes", editingNote.id);
      await updateDoc(noteRef, {
        title: editingNote.title,
        content: editingNote.content,
        userId: auth.currentUser.uid,
      });
      setNotes(
        notes.map((note) => (note.id === editingNote.id ? editingNote : note))
      );
      setEditingNote(null);
    }
  };

  const deleteNote = async (id) => {
    const noteRef = doc(db, "notes", id);
    await deleteDoc(noteRef);
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <section className="min-h-screen bg-gray-900 text-white px-4 sm:px-8">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          Welcome, {user ? user.email : "User"}
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>

        <div className="mb-8">
          {!showNoteForm ? (
            <button
              onClick={() => setShowNoteForm(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Note
            </button>
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                Add New Note
              </h2>
              <input
                type="text"
                placeholder="Note Title"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                className="bg-gray-700 text-white px-4 py-3 rounded-md w-full mb-4"
              />
              <textarea
                placeholder="Note Content"
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                className="bg-gray-700 text-white px-4 py-3 rounded-md w-full mb-4"
                rows="4"
              />
              <button
                onClick={addNote}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Add Note
              </button>
              <button
                onClick={() => setShowNoteForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 ml-4"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <p className="text-gray-400 text-center col-span-full">
              No notes available. Add a new note!
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-800 p-6 rounded-lg shadow-md"
              >
                {editingNote?.id === note.id ? (
                  <>
                    <input
                      type="text"
                      value={editingNote.title}
                      onChange={(e) =>
                        setEditingNote({
                          ...editingNote,
                          title: e.target.value,
                        })
                      }
                      className="bg-gray-700 text-white px-4 py-3 rounded-md w-full mb-4"
                    />
                    <textarea
                      value={editingNote.content}
                      onChange={(e) =>
                        setEditingNote({
                          ...editingNote,
                          content: e.target.value,
                        })
                      }
                      className="bg-gray-700 text-white px-4 py-3 rounded-md w-full mb-4"
                      rows="4"
                    />
                    <button
                      onClick={updateNote}
                      className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingNote(null)}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 ml-4"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-2">{note.title}</h3>
                    <p>{note.content.slice(0, 100)}...</p>
                    <div className="mt-4 flex justify-end space-x-4">
                      <button
                        onClick={() => setEditingNote(note)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
