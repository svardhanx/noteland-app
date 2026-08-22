import { Divider } from "@mui/material";
import CompletedTasks from "./CompletedTasks";
import CurrentTasks from "./CurrentTasks";
import PropTypes from "prop-types";

const TaskManager = ({ tasks }) => {
  const hasTasks = tasks?.length > 0;

  const pendingTasks = hasTasks ? tasks?.filter((task) => !task.completed) : [];

  const completedTasks = hasTasks
    ? tasks?.filter((task) => task.completed)
    : [];

  return (
    <div className="flex flex-col gap-2 py-2" data-component="task-manager">
      <p className="text-white underline underline-offset-6 uppercase font-bold">
        TASKS LISTS
      </p>

      {/* ONGOING TASKS */}
      <p className="text-white text-base opacity-75">Your Pending Tasks</p>
      {pendingTasks?.length > 0 ? (
        pendingTasks.map((task) => (
          <div className="ongoing-tasks" key={task?.id}>
            <CurrentTasks task={task} />
          </div>
        ))
      ) : (
        <p className="text-white opacity-75">No pending tasks. Create a task</p>
      )}

      <Divider color="white" variant="fullWidth" className="h-0.5" />

      {/* COMPLETED TASKS */}
      {completedTasks?.length > 0 && (
        <>
          <p className="text-white text-base opacity-75">Completed Tasks</p>
          {completedTasks.map((task) => (
            <div className="completed-tasks" key={task?.id}>
              <CompletedTasks task={task} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

TaskManager.propTypes = {
  tasks: PropTypes.array,
};
export default TaskManager;
