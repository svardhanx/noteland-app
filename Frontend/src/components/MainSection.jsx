import { useContext } from "react";
import NewNote from "./NewNote";
import { NotesContext } from "../context/NotesContext";
import NoteView from "./NoteView";
import AllNotes from "./AllNotes";

const MainSection = () => {
  const { noteView } = useContext(NotesContext);

  return (
    <main
      className="flex bg-secondary flex-auto overflow-y-hidden h-screen"
      data-component="main-section"
    >
      <NewNote />
      {noteView ? <NoteView /> : <AllNotes />}
    </main>
  );
};

export default MainSection;
