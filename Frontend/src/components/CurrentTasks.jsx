import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { apiEndPoints } from "../utils/apiEndpoints";
import { useMutation } from "../hooks/use-mutation";
import { useNotesStore } from "../store/notesStore";

const CurrentTasks = ({ task }) => {
  const { fetchNotes } = useNotesStore();

  const updateTaskMutation = useMutation();

  async function handleTaskCompletion(id) {
    if (!id) {
      toast.error("Task ID not found..");
      return;
    }

    try {
      const url = apiEndPoints.UPDATE_TASK;

      const payload = { id, status: true };

      const result = await updateTaskMutation.mutate(url, payload, "PATCH");

      toast.success(result?.message);

      await fetchNotes();
    } catch (error) {
      console.error("Error while updating the task: ", error.message);
    }
  }

  return (
    <div className="flex items-center gap-2.5">
      <input
        type="checkbox"
        name="current-task"
        id="current-task"
        className="w-4 h-4 rounded-full cursor-pointer appearance-none border-[0.095rem] p-1 border-[#c09494]"
        onClick={() => handleTaskCompletion(task.id)}
        value={task?.task_name}
      />
      <label className="text-white">{task?.task_name}</label>
    </div>
  );
};

CurrentTasks.propTypes = {
  task: PropTypes.object,
};

export default CurrentTasks;
