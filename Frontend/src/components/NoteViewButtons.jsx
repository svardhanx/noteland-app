import { Delete, Edit } from "lucide-react";
import PropTypes from "prop-types";
import Button from "../ui/button";
import { NOTE_VIEW_KINDS } from "../utils/constants";

export default function NoteViewButtons({
  setOpenTaskDialog,
  setNoteViewKind,
  handleDeleteNote,
  isDeleting,
}) {
  return (
    <div className="note-view-btns">
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
  setOpenTaskDialog: PropTypes.func,
  setNoteViewKind: PropTypes.func,
  setOpenEditModal: PropTypes.func,
  handleDeleteNote: PropTypes.func,
  isDeleting: PropTypes.bool,
};
