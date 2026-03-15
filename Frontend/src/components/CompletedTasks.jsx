import { CircleCheck } from "lucide-react";
import PropTypes from "prop-types";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import { toast } from "react-toastify";
import { apiEndPoints } from "../utils/apiEndpoints";
import { useMutation } from "../hooks/use-mutation";

const CompletedTasks = ({ task }) => {
  const { refreshNotes, setRefreshNotes } = useContext(NotesContext);

  const updateTaskMutation = useMutation();

  async function handleTaskCompletion(id) {
    if (!id) {
      toast.error("Task ID not found..");
      return;
    }

    try {
      const url = apiEndPoints.UPDATE_TASK;

      const payload = { id, status: false };

      const result = await updateTaskMutation.mutate(url, payload, "PATCH");

      toast.success(result?.message);

      setRefreshNotes(!refreshNotes);
    } catch (error) {
      console.error("Error while updating the task: ", error.message);
    }
  }

  return (
    <div className="flex items-center gap-1.5" title="Mark as incomplete">
      <CircleCheck
        className="text-white bg-success rounded-full cursor-pointer"
        size={20}
        onClick={() => handleTaskCompletion(task.id)}
      />
      <span className="text-white line-through">{task?.task_name}</span>
    </div>
  );
};

CompletedTasks.propTypes = {
  task: PropTypes.object,
};

export default CompletedTasks;
