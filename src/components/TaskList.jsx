import React from "react";

const TaskList = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <p className="mt-2 mb-0">
        Add three to five small tasks to keep the sprint manageable.
      </p>
    );
  }

  return (
    <ul className="mt-2 mb-0 ps-3">
      {tasks.map((task, index) => (
        <li key={index}>{task}</li>
      ))}
    </ul>
  );
};

export default TaskList;
