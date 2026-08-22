import { Fab } from "@mui/material";
import { Plus } from "lucide-react";
import { useNotesStore } from "../store/notesStore";

const NewNoteIcon = () => {
  const setNewNote = useNotesStore((s) => s.setNewNote);

  const setNoteView = useNotesStore((s) => s.setNoteView);

  const handleNewNoteButton = () => {
    setNewNote(true);
    setNoteView(false);
  };

  return (
    <div
      className="fixed right-4 bottom-[clamp(2rem,5vh,5rem)]"
      onClick={handleNewNoteButton}
    >
      <Fab color="primary" aria-label="add" size="medium" title="Add a note">
        <Plus />
      </Fab>
    </div>
  );
};

export default NewNoteIcon;
