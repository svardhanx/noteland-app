import CompletedTasks from "./CompletedTasks";
import CurrentTasks from "./CurrentTasks";
import PropTypes from "prop-types";

const TaskManager = ({ tasks }) => {
  console.log("tasks", tasks);

  return (
    <div className="flex flex-col gap-2" data-component="task-manager">
      <p className="text-white underline underline-offset-6 uppercase font-bold">
        TASKS LISTS
      </p>

      {/* ONGOING TASKS */}
      <p className="text-white text-base opacity-75">Your Pending Tasks</p>
      {tasks?.length > 0 &&
        tasks.map(
          (task) =>
            !task?.completed && (
              <div className="ongoing-tasks" key={task?.id}>
                <CurrentTasks task={task} />
              </div>
            ),
        )}

      <hr />

      {/* COMPLETED TASKS */}
      <p className="text-white text-base opacity-75">Completed Tasks</p>
      {tasks?.length > 0 &&
        tasks.map(
          (task) =>
            task?.completed && (
              <div className="completed-tasks" key={task?.id}>
                <CompletedTasks task={task} />
              </div>
            ),
        )}
    </div>
  );
};

TaskManager.propTypes = {
  tasks: PropTypes.array,
};
export default TaskManager;
