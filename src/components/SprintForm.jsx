import React, { useState } from "react";
import TaskList from "./TaskList";

const SprintForm = () => {
  const [sprintName, setSprintName] = useState("");
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (event) => {
    event.preventDefault();            // stop page refresh
    const next = taskInput.trim();
    if (!next) return;                 // ignore empty input
    setTasks((prev) => [...prev, next]); // append new task
    setTaskInput("");                  // clear the input box
  };

  return (
    <main className="container py-5">
      <div className="row g-5">
        {/* Left side: form */}
        <div className="col-lg-7">
          <h1 className="mb-3">Start a new sprint</h1>
          <p>
            Name the assignment, choose a focus window, and add a few short
            tasks you want to finish this session.
          </p>

          <form onSubmit={handleAddTask} className="mt-4">
            <div className="mb-4">
              <label htmlFor="sprintName" className="form-label">
                Assignment or sprint name
              </label>
              <input
                id="sprintName"
                type="text"
                className="form-control"
                placeholder="CS571 project milestone"
                value={sprintName}
                onChange={(e) => setSprintName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="focusWindow" className="form-label">
                Focus window (minutes)
              </label>
              <input
                id="focusWindow"
                type="number"
                min="5"
                max="90"
                className="form-control"
                value={focusMinutes}
                onChange={(e) => setFocusMinutes(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="taskInput" className="form-label">
                Add a short task
              </label>
              <div className="d-flex gap-2">
                <input
                  id="taskInput"
                  type="text"
                  className="form-control"
                  placeholder="Draft intro paragraph"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right side: live preview */}
        <div className="col-lg-5">
          <section>
            <h2 className="h4 mb-3">Sprint preview</h2>
            <p className="mb-1">
              <strong>Title:</strong>{" "}
              {sprintName.trim() === "" ? "Untitled sprint" : sprintName}
            </p>
            <p className="mb-3">
              <strong>Focus window:</strong> {focusMinutes || 0} minutes
            </p>
            <div>
              <strong>Tasks:</strong>
              <TaskList tasks={tasks} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SprintForm;
