import { useRef } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { useAuthStore } from "../store/authStore";
import { useNotesStore } from "../store/notesStore";

export default function NotesContainer() {
  const user = useAuthStore((s) => s.user);

  const allNotes = useNotesStore((s) => s.allNotes);
  const setCurrentSelectedNote = useNotesStore((s) => s.setCurrentSelectedNote);
  const setCurrentSelectedNoteID = useNotesStore(
    (s) => s.setCurrentSelectedNoteID,
  );
  const setNewNote = useNotesStore((s) => s.setNewNote);
  const setPlaceholder = useNotesStore((s) => s.setPlaceholder);
  const setNoteView = useNotesStore((s) => s.setNoteView);
  const setNotesContainer = useNotesStore((s) => s.setNotesContainer);

  const notesContainerRef = useRef();

  const isMobile = useIsMobile();

  const renderNoteView = (note) => {
    setCurrentSelectedNote(note);
    setCurrentSelectedNoteID(note.id);
    setNewNote(false);
    setPlaceholder(false);
    setNoteView(true);
    isMobile && setNotesContainer(false);
  };

  return (
    <div className="notes-container" ref={notesContainerRef}>
      {allNotes &&
        user &&
        allNotes.map((note) => {
          return (
            <div
              key={crypto.randomUUID()}
              className="note"
              onClick={() => renderNoteView(note)}
            >
              <h4 className="note-title">{note.title}</h4>
              <div className="separator"></div>
              <p className="note-content">{note.content}</p>
            </div>
          );
        })}
    </div>
  );
}
