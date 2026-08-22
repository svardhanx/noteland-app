import NewNote from "./NewNote";
import NoteView from "./NoteView";
import AllNotes from "./AllNotes";
import { useNotesStore } from "../store/notesStore";

const MainSection = () => {
  const noteView = useNotesStore((s) => s.noteView);

  return (
    <main
      className="flex bg-secondary flex-auto min-h-0"
      data-component="main-section"
    >
      <NewNote />
      {noteView ? <NoteView /> : <AllNotes />}
    </main>
  );
};

export default MainSection;
