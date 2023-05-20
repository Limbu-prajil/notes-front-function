import React, { useState, useEffect } from 'react';
import Note from './Note';
import noteService from './services/notes';
import Notification from './Notification';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    noteService
      .read()
      .then((notes) => {
        setNotes(notes);
      })
      .catch((error) => {
        setError(`Note unfortunately not found from serverr.`);
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    };

    noteService
      .create(noteObject)
      .then((newNoteObj) => {
        setNotes([...notes, newNoteObj]);
        setNewNote('');
      })
      .catch((error) => {
        setError(`Note '${noteObject.content}' have been already unfortunately added to server.`);
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const toggleVisible = () => {
    setShowAll(!showAll);
  };

  const toggleImportanceOf = (id) => () => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((changedNote) => {
        const updatedNotes = notes.map((note) => (note.id !== id ? note : changedNote));
        setNotes(updatedNotes);
      })
      .catch((error) => {
        setError(`Note '${note.content}' have been already unfortunately removed from server.`);
        const updatedNotes = notes.filter((n) => n.id !== id);
        setNotes(updatedNotes);
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important === true);
  const label = showAll ? 'Only important' : 'All';

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={error} />
      <div>
        <button onClick={toggleVisible}>Show {label}</button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} toggleImportance={toggleImportanceOf(note.id)} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
