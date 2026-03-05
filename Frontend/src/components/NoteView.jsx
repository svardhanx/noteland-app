import { useContext, useEffect } from "react";
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
import { CircleX, Edit } from "lucide-react";
import { apiEndPoints } from "../utils/apiEndpoints";
import { useMutation } from "../hooks/use-mutation";

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

  // const [openEditModal, setOpenEditModal] = useState(false);

  const isMobile = useIsMobile();

  const editMutation = useMutation();

  const deleteMutation = useMutation();

  function handleClose() {
    reset();
    setNoteViewKind(NOTE_VIEW_KINDS.VIEW);
  }

  async function handleDeleteNote() {
    try {
      const result = await deleteMutation.mutate(
        `${apiEndPoints.DELETE_NOTE}/${currentSelectedNote.id}`,
        null,
        "DELETE",
      );

      toast.success(result?.message);
      setNoteView(false);
      setRefreshNotes(!refreshNotes);
    } catch (error) {
      console.error("Error deleting the note: ", error.message);
      console.error("Cause of the error: ", error?.cause);
    }
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
      setRefreshNotes(!refreshNotes);
      setCurrentSelectedNote(result?.data);
      handleClose();
      editMutation.reset();
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
            <section>
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
                handleDeleteNote={handleDeleteNote}
                isDeleting={deleteMutation.isLoading}
              />
            </div>
          )}
        </div>
      </form>

      <TaskCreator />

      {/* <EditNoteModal
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        currentSelectedNote={currentSelectedNote}
      /> */}
    </div>
  );
};

export default NoteView;
