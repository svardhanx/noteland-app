import { useContext, useState } from "react";
import { NotesContext } from "../context/NotesContext.js";
import { toast } from "react-toastify";
import Button from "../ui/button.jsx";
import { Ban, Pen } from "lucide-react";
import { Modal } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { apiEndPoints } from "../utils/apiEndpoints.js";

const defaultValues = {
  title: "",
  content: "",
};

const NewNote = () => {
  const { refreshNotes, setRefreshNotes, newNote, setNewNote, setPlaceholder } =
    useContext(NotesContext);

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const handleCreateNewNote = async (noteData) => {
    try {
      setIsLoading(true);
      const response = await fetch(apiEndPoints.CREATE_NOTE, {
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
      handleClose();
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

  function handleClose() {
    setNewNote(false);
    reset();
    // setPlaceholder(true);
  }

  return (
    <Modal
      open={newNote}
      onClose={handleClose}
      className="flex items-center justify-center"
    >
      <form
        className="flex flex-col items-center justify-center bg-white gap-4 rounded-md p-4 w-full md:w-4/5 lg:w-3/5"
        onSubmit={handleSubmit(handleCreateNewNote)}
      >
        <h1 className="text-lg font-medium">Add a Note</h1>
        <Controller
          control={control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => {
            return (
              <div className="flex flex-col gap-1 w-full items-center">
                <input
                  {...field}
                  type="text"
                  id="input-title"
                  placeholder="Note Title"
                  name="title"
                  className="border-0 border-b-2 border-b-black p-4 outline-0 w-3/5"
                />
                {errors?.title?.message && (
                  <p className="text-error text-sm font-bold">
                    {errors?.title?.message}
                  </p>
                )}
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="content"
          rules={{ required: "Description is required" }}
          render={({ field }) => {
            return (
              <div className="flex flex-col gap-1 w-full items-center">
                <textarea
                  {...field}
                  id="input-content"
                  rows="10"
                  cols="30"
                  placeholder="Note description"
                  name="content"
                  className="border-0 border-b-2 border-b-black p-4 outline-0 w-3/5 resize-none whitespace-pre-wrap"
                ></textarea>
                {errors?.content?.message && (
                  <p className="text-error text-sm font-bold">
                    {errors?.content?.message}
                  </p>
                )}
              </div>
            );
          }}
        />
        <div className="flex items-center justify-center gap-3">
          <Button
            variant={"info"}
            isLoading={isLoading}
            type={"submit"}
            leftSection={<Pen size={14} />}
          >
            Create Note
          </Button>
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
    </Modal>
  );
};

export default NewNote;
