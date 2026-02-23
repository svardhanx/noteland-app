import { useContext, useEffect, useState } from "react";
import { NotesContext } from "../context/NotesContext";
import TaskCreator from "./TaskCreator";
import TaskManager from "./TaskManager";
import { toast } from "react-toastify";
import { NOTE_VIEW_KINDS } from "../utils/constants";
// import EditNoteModal from "./EditNoteModal";
// import { Delete, Edit } from "lucide-react";
import NoteViewButtons from "./NoteViewButtons";
import { useIsMobile } from "../hooks/use-mobile";
import { Controller, useForm } from "react-hook-form";
import Button from "../ui/button";
import { Edit } from "lucide-react";
import { apiEndPoints } from "../utils/apiEndpoints";

const NoteView = () => {
  const {
    currentSelectedNote,
    setNoteView,
    refreshNotes,
    setRefreshNotes,
    noteViewKind,
    setNoteViewKind,
    setCurrentSelectedNote,
  } = useContext(NotesContext);

  const isEdit = NOTE_VIEW_KINDS.EDIT === noteViewKind;

  const defaultValues = {
    title: currentSelectedNote.title,
    content: currentSelectedNote.content,
  };

  const { control, reset, handleSubmit } = useForm({ defaultValues });

  const [openTaskDialog, setOpenTaskDialog] = useState(false);

  // const [openEditModal, setOpenEditModal] = useState(false);

  const isMobile = useIsMobile();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleClose() {
    reset();
    setNoteViewKind(NOTE_VIEW_KINDS.VIEW);
    setIsUpdating(false);
  }

  async function handleDeleteNote() {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `${apiEndPoints.DELETE_NOTE}/${currentSelectedNote.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Server didn't respond with a success state.");
      }

      const data = await response.json();
      toast.success(data.message);
      setNoteView(false);
      setRefreshNotes(!refreshNotes);
    } catch (error) {
      console.error("Error deleting the note: ", error.message);
      console.error("Cause of the error: ", error?.cause);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleEdit(data) {
    const payload = {
      ...data,
      id: currentSelectedNote.id,
      user_id: currentSelectedNote.user_id,
    };
    setIsUpdating(true);

    try {
      const response = await fetch(apiEndPoints.UPDATE_NOTE, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Server didn't respond with a success state.");
      }

      const data = await response.json();
      toast.success(data.message);
      setRefreshNotes(!refreshNotes);
      setCurrentSelectedNote(data.data);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!isEdit) return;
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  return (
    <div
      className="flex flex-col w-full h-auto flex-auto overflow-y-auto"
      data-component="note-view"
    >
      <form onSubmit={handleSubmit(handleEdit)}>
        <div
          className="flex flex-col gap-2 p-4"
          data-element="note-view-heading"
        >
          <p className="text-white underline underline-offset-3 uppercase font-bold">
            NOTE TITLE:
          </p>
          <div className="flex items-center justify-between gap-2">
            <section className="w-full">
              {noteViewKind === NOTE_VIEW_KINDS.EDIT ? (
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => {
                    return (
                      <input
                        {...field}
                        placeholder="Add a heading"
                        className="text-white border-2 border-blue-500 px-1 py-2 rounded-md w-full outline-0"
                      />
                    );
                  }}
                />
              ) : (
                <h2 className="text-white">{currentSelectedNote.title}</h2>
              )}
            </section>

            <section>
              {noteViewKind === NOTE_VIEW_KINDS.EDIT ? (
                <Button
                  type={"submit"}
                  leftSection={<Edit size={14} />}
                  disabled={isUpdating}
                  isLoading={isUpdating}
                  className={"w-fit shrink-0"}
                >
                  Update
                </Button>
              ) : (
                <NoteViewButtons
                  // setOpenEditModal={setOpenEditModal}
                  setOpenTaskDialog={setOpenTaskDialog}
                  setNoteViewKind={setNoteViewKind}
                  handleDeleteNote={handleDeleteNote}
                  isDeleting={isDeleting}
                />
              )}
            </section>
          </div>
        </div>

        <div className="w-full h-0.5 bg-white" />
        {/* CONTENT DIV */}
        <div
          className="flex flex-col rounded-lg p-4 gap-4 flex-auto overflow-y-auto"
          data-element="note-view-content"
        >
          <p className="text-white underline underline-offset-6 uppercase font-bold">
            NOTE CONTENT:
          </p>

          {noteViewKind === NOTE_VIEW_KINDS.EDIT ? (
            <Controller
              control={control}
              name="content"
              render={({ field }) => {
                return (
                  <textarea
                    {...field}
                    id="description"
                    placeholder="Your description goes here"
                    className="border-2 border-blue-500 text-white px-2 py-3 rounded-md w-full outline-0"
                    rows={10}
                  ></textarea>
                );
              }}
            />
          ) : (
            <p className="py-4 whitespace-pre-wrap overflow-y-auto text-white">
              {currentSelectedNote.content}
            </p>
          )}

          {currentSelectedNote?.tasks?.length > 0 && (
            <TaskManager tasks={currentSelectedNote.tasks} />
          )}
          {isMobile && (
            <div className="flex flex-col gap-0.5">
              <div className="separator"></div>
              <NoteViewButtons
                // setOpenEditModal={setOpenEditModal}
                setOpenTaskDialog={setOpenTaskDialog}
                handleDeleteNote={handleDeleteNote}
              />
            </div>
          )}
        </div>
      </form>
      <TaskCreator
        openTaskDialog={openTaskDialog}
        setOpenTaskDialog={setOpenTaskDialog}
      />

      {/* <EditNoteModal
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        currentSelectedNote={currentSelectedNote}
      /> */}
    </div>
  );
};

export default NoteView;
