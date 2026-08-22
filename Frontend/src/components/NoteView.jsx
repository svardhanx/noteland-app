import { useEffect, useMemo } from "react";
import TaskCreator from "./TaskCreator";
import TaskManager from "./TaskManager";
import { toast } from "react-toastify";
import { NOTE_VIEW_KINDS } from "../utils/constants";
import NoteViewButtons from "./NoteViewButtons";
import { useIsMobile } from "../hooks/use-mobile";
import { Controller, useForm } from "react-hook-form";
import Button from "../ui/button";
import { CircleX, Copy, Edit } from "lucide-react";
import { apiEndPoints } from "../utils/apiEndpoints";
import { useMutation } from "../hooks/use-mutation";
import { useNotesStore } from "../store/notesStore";
import { Divider } from "@mui/material";
import ActionItemPopup from "./ActionItemPopup";

const NoteView = () => {
  const setNoteView = useNotesStore((s) => s.setNoteView);
  const noteViewKind = useNotesStore((s) => s.noteViewKind);
  const setNoteViewKind = useNotesStore((s) => s.setNoteViewKind);
  const setCurrentSelectedNote = useNotesStore((s) => s.setCurrentSelectedNote);
  const currentSelectedNote = useNotesStore((s) => s.currentSelectedNote);
  const fetchNotes = useNotesStore((s) => s.fetchNotes);
  const setOpenActionItemPopup = useNotesStore((s) => s.setOpenActionItemPopup);
  const setActionItemHelperData = useNotesStore(
    (s) => s.setActionItemHelperData,
  );

  const isEdit = NOTE_VIEW_KINDS.EDIT === noteViewKind;

  const defaultValues = useMemo(
    () => ({
      title: currentSelectedNote.title,
      content: currentSelectedNote.content,
    }),
    [currentSelectedNote.title, currentSelectedNote.content],
  );

  const { control, reset, handleSubmit } = useForm({ defaultValues });

  const isMobile = useIsMobile();

  const editMutation = useMutation();

  const deleteMutation = useMutation();

  function handleClose() {
    reset();
    setNoteViewKind(NOTE_VIEW_KINDS.VIEW);
  }

  async function deleteNote() {
    try {
      const result = await deleteMutation.mutate(
        `${apiEndPoints.DELETE_NOTE}/${currentSelectedNote.id}`,
        null,
        "DELETE",
      );

      toast.success(result?.message);
      setNoteView(false);
      await fetchNotes();
    } catch (error) {
      console.error("Error deleting the note: ", error.message);
      console.error("Cause of the error: ", error?.cause);
    }
  }

  function handleDeleteNote() {
    setOpenActionItemPopup(true);

    setActionItemHelperData({
      title: "Are you sure, you want to delete this note?",
      leftButtonName: "Delete Note",
      fn: deleteNote,
      isPending: deleteMutation.isLoading,
    });
    return;
  }

  async function handleEdit(formdata) {
    const payload = {
      ...formdata,
      id: currentSelectedNote.id,
      user_id: currentSelectedNote.user_id,
    };

    try {
      const result = await editMutation.mutate(
        apiEndPoints.UPDATE_NOTE,
        payload,
        "PUT",
      );

      toast.success(result?.message);
      await fetchNotes();
      setCurrentSelectedNote(result?.data);
      handleClose();
      editMutation.reset();
    } catch (error) {
      console.error(error);
    }
  }

  async function copyContent(data) {
    await navigator.clipboard.writeText(data);
    toast.success("Content copied");
  }

  useEffect(() => {
    if (!isEdit) return;
    reset(defaultValues);
  }, [defaultValues, isEdit, reset]);

  return (
    <div className="flex flex-col w-full h-full" data-component="note-view">
      <form
        onSubmit={handleSubmit(handleEdit)}
        className="flex flex-col gap-2 flex-auto min-h-0"
      >
        <div
          className="flex flex-col gap-2 p-4"
          data-element="note-view-heading"
        >
          <p className="text-white underline underline-offset-3 uppercase font-bold">
            NOTE TITLE:
          </p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <section>
              {isEdit ? (
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => {
                    return (
                      <input
                        {...field}
                        placeholder="Add a heading"
                        className="text-black bg-white border-2 border-blue-500 px-1 py-2 rounded-md w-full outline-0"
                      />
                    );
                  }}
                />
              ) : (
                <h2 className="text-white">{currentSelectedNote.title}</h2>
              )}
            </section>

            <section className="hidden md:flex md:items-center md:gap-2">
              {isEdit ? (
                <div className="flex items-center gap-2">
                  <Button
                    type={"submit"}
                    leftSection={<Edit size={16} />}
                    disabled={editMutation.isLoading}
                    isLoading={editMutation.isLoading}
                    className={"w-fit shrink-0"}
                  >
                    Update
                  </Button>
                  <Button
                    type={"button"}
                    leftSection={<CircleX size={16} />}
                    onClick={() => setNoteViewKind(NOTE_VIEW_KINDS.VIEW)}
                    disabled={editMutation.isLoading}
                    variant="error"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <NoteViewButtons
                  handleDeleteNote={handleDeleteNote}
                  isDeleting={deleteMutation.isLoading}
                />
              )}
            </section>
          </div>
        </div>

        <Divider color="white" variant="fullWidth" className="h-0.5" />

        {/* CONTENT DIV */}
        <div
          className="flex flex-col rounded-lg p-4 gap-4 overflow-y-auto flex-1 min-h-0"
          data-element="note-view-content"
        >
          <div className="p-1 flex items-center justify-between">
            <p className="text-white underline underline-offset-6 uppercase font-bold">
              NOTE CONTENT:
            </p>

            {!isEdit && (
              <div
                className="flex items-center gap-1 hover:cursor-pointer hover:underline text-white"
                onClick={() => copyContent(currentSelectedNote.content)}
              >
                <span>Copy content</span>
                <Copy color="white" size={18} />
              </div>
            )}
          </div>

          {isEdit ? (
            <Controller
              control={control}
              name="content"
              render={({ field }) => {
                return (
                  <textarea
                    {...field}
                    id="description"
                    placeholder="Your description goes here"
                    className="border-2 border-blue-500 text-black bg-white px-2 py-3 rounded-md w-full outline-0"
                    rows={10}
                  ></textarea>
                );
              }}
            />
          ) : (
            <div
              className="py-4 px-1 whitespace-pre-wrap text-white max-h-60 overflow-auto"
              data-component="note-content"
            >
              {currentSelectedNote.content}
            </div>
          )}

          <Divider color="white" variant="fullWidth" className="h-0.5" />

          {currentSelectedNote?.tasks?.length > 0 && (
            <TaskManager tasks={currentSelectedNote.tasks} />
          )}

          {isMobile && (
            <div className="flex flex-col gap-0.5">
              <NoteViewButtons
                handleDeleteNote={handleDeleteNote}
                isDeleting={deleteMutation.isLoading}
              />
            </div>
          )}
        </div>
      </form>

      <TaskCreator />
      <ActionItemPopup />
    </div>
  );
};

export default NoteView;
