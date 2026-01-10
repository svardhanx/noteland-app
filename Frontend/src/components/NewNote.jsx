import { useContext, useState } from "react";
import { NotesContext } from "../context/NotesContext.js";
import notify from "../toasts/WarningToast.js";
import { toast } from "react-toastify";
import { VITE_BACKEND_URL } from "../utils/constants.js";
import Button from "../ui/button.jsx";
import { Ban, Pen } from "lucide-react";

const NewNote = () => {
  const { refreshNotes, setRefreshNotes, setNewNote, setPlaceholder } =
    useContext(NotesContext);

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNewNote = async (event) => {
    event.preventDefault();
    const { title, content } = event.target.elements;

    if (title.value?.trim() === "" || content.value?.trim() === "") {
      notify("Title and content are required to create a note.");
      return;
    }

    const noteData = Object.fromEntries(new FormData(event.target));

    try {
      setIsLoading(true);
      const response = await fetch(`${VITE_BACKEND_URL}/notes/create-note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Something wen't wrong.");
      }

      const data = await response.json();
      const { message } = data;
      toast.success(message);
      setRefreshNotes(!refreshNotes);
      event.target.reset();
    } catch (error) {
      console.error("Error while creating a new note: ", error.message);
      toast.error("Unable to create a new note: ", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  function handleCancelNoteButton() {
    setNewNote(false);
    setPlaceholder(true);
    toast.info("Note cancelled.");
  }
  return (
    <form className="new-note" onSubmit={handleCreateNewNote}>
      <input
        type="text"
        id="input-title"
        placeholder="Note Title"
        name="title"
      />
      <textarea
        id="input-content"
        rows="10"
        cols="30"
        placeholder="Note description"
        name="content"
      ></textarea>
      <div className="btns">
        {/* <button type="submit" className="create-note">
          Create Note
        </button> */}
        <Button
          variant={"info"}
          isLoading={isLoading}
          type={"submit"}
          leftSection={<Pen size={14} />}
        >
          Create Note
        </Button>
        {/* <button
          type="button"
          className="cancel-note"
          onClick={handleCancelNoteButton}
        >
          Cancel Note
        </button> */}
        <Button
          type={"button"}
          onClick={handleCancelNoteButton}
          variant={"error"}
          disabled={isLoading}
          leftSection={<Ban size={14} />}
        >
          Cancel Note
        </Button>
      </div>
    </form>
  );
};

export default NewNote;
