import { toast } from "react-toastify";
import { Modal } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import FieldError from "./Common/FieldError.jsx";
import { useMutation } from "../hooks/use-mutation.jsx";
import { apiEndPoints } from "../utils/apiEndpoints.js";
import Button from "../ui/button.jsx";
import { useNotesStore } from "../store/notesStore.js";

const TaskCreator = () => {
  const currentSelectedNote = useNotesStore((s) => s.currentSelectedNote);
  const openTaskDialog = useNotesStore((s) => s.openTaskDialog);
  const setOpenTaskDialog = useNotesStore((s) => s.setOpenTaskDialog);
  const fetchNotes = useNotesStore((s) => s.fetchNotes);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { task_name: "" } });

  const taskMutation = useMutation();

  // FUNCTION HANDLE TASK SUBMISSION
  async function handleCreateTaskSubmission(formdata) {
    const url = `${apiEndPoints.CREATE_TASK}/${currentSelectedNote.id}`;

    try {
      const result = await taskMutation.mutate(url, formdata, "POST");

      toast.success(result?.message);

      await fetchNotes();
      handleClose();
    } catch (error) {
      console.error("Error while creating task: ", error.message);
      toast.error("Error while creating task");
    }
  }

  function handleClose() {
    setOpenTaskDialog(false);
    reset();
  }

  return (
    <Modal
      open={openTaskDialog}
      onClose={handleClose}
      className="flex items-center justify-center"
    >
      <form
        method="dialog"
        className="flex flex-col gap-3 p-4 bg-white border-2 border-white rounded-md w-xl"
        onSubmit={handleSubmit(handleCreateTaskSubmission)}
      >
        <h3 className="font-semibold text-xl">Enter New Task:</h3>
        <Controller
          control={control}
          name="task_name"
          rules={{
            required: "task name is required",
          }}
          render={({ field }) => {
            return (
              <div className="flex flex-col gap-1">
                <input
                  {...field}
                  type="text"
                  placeholder="Task Name"
                  className="outline-0 p-2 rounded-md text-lg border-2 border-black w-full"
                />
                {errors?.task_name?.message && (
                  <FieldError message={errors?.task_name?.message} />
                )}
              </div>
            );
          }}
        />

        <Button
          className="bg-info"
          type="submit"
          isLoading={taskMutation.isLoading}
          disabled={taskMutation.isLoading}
        >
          Create Task
        </Button>
      </form>
    </Modal>
  );
};

export default TaskCreator;
