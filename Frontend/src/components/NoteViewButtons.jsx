import { Delete, Edit } from "lucide-react";
import PropTypes from "prop-types";
import Button from "../ui/button";
import { NOTE_VIEW_KINDS } from "../utils/constants";
import { useNotesStore } from "../store/notesStore";

export default function NoteViewButtons({ handleDeleteNote, isDeleting }) {
  const setOpenTaskDialog = useNotesStore((s) => s.setOpenTaskDialog);

  const setNoteViewKind = useNotesStore((s) => s.setNoteViewKind);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        onClick={() => setOpenTaskDialog(true)}
        leftSection={<Edit size={14} />}
        variant={"info"}
        disabled={isDeleting}
      >
        New Task
      </Button>

      <Button
        onClick={() => setNoteViewKind(NOTE_VIEW_KINDS.EDIT)}
        leftSection={<Edit size={14} />}
        disabled={isDeleting}
      >
        Edit Note
      </Button>

      <Button
        onClick={handleDeleteNote}
        leftSection={<Delete size={14} />}
        variant={"error"}
        isLoading={isDeleting}
      >
        Delete Note
      </Button>
    </div>
  );
}

NoteViewButtons.propTypes = {
  handleDeleteNote: PropTypes.func,
  isDeleting: PropTypes.bool,
};
