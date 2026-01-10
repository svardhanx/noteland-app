import { Delete, Edit } from "lucide-react";
import PropTypes from "prop-types";
import Button from "../ui/button";

export default function NoteViewButtons({
  setOpenEditModal,
  setOpenTaskDialog,
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
        onClick={() => setOpenEditModal(true)}
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
  setOpenEditModal: PropTypes.func,
  handleDeleteNote: PropTypes.func,
  isDeleting: PropTypes.bool,
};

{
  /* <>
  <button className="new-task">
    <Edit className="note-view-btn-icon" /> <span>New Task</span>
  </button>
  <button className="edit-note">
    <Edit className="note-view-btn-icon" /> <span>Edit Note</span>
  </button>
  <button className="delete-note">
    <Delete className="note-view-btn-icon" /> <span>Delete Note</span>
  </button>
</> */
}
