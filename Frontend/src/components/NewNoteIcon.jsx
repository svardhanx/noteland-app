import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import { Fab } from "@mui/material";
import { Plus } from "lucide-react";
import { NOTE_VIEW_KINDS } from "../utils/constants";

const NewNoteIcon = () => {
  const { setNewNote, setPlaceholder, setNoteView, setNoteViewKind } =
    useContext(NotesContext);

  const handleNewNoteButton = () => {
    setNewNote(true);
    // setPlaceholder(false);
    setNoteView(false);
    // setNoteViewKind(NOTE_VIEW_KINDS.ADD);
  };

  return (
    // <div className="new-note-icon">
    //   <img
    //     src="/plus.png"
    //     alt="Plus icon"
    //     loading="lazy"
    //     className="plus-icon"
    //     title="New Note"
    //     onClick={handleNewNoteButton}
    //   />
    // </div>
    <div className="absolute right-5 bottom-10" onClick={handleNewNoteButton}>
      <Fab color="primary" aria-label="add" size="medium" title="Add a note">
        <Plus />
      </Fab>
    </div>
  );
};

export default NewNoteIcon;
