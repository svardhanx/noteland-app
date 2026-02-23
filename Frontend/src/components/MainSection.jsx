import { useContext } from "react";
import NewNote from "./NewNote";
import { NotesContext } from "../context/NotesContext";
import NoteView from "./NoteView";
import AllNotes from "./AllNotes";

const MainSection = () => {
  const { noteView } = useContext(NotesContext);

  return (
    <section
      className="flex bg-secondary flex-auto overflow-y-auto"
      data-component="main-section"
    >
      <NewNote />
      {noteView ? <NoteView /> : <AllNotes />}
    </section>
  );
};

export default MainSection;
