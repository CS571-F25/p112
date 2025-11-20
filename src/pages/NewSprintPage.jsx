import React, { useState } from "react";

function NewSprintPage() {
  const [assignmentName, setAssignmentName] = useState("");
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);

  function handleAddTask() {
    const trimmed = taskText.trim();
    if (!trimmed) return;
    setTasks((prev) => [...prev, trimmed]);
    setTaskText("");
  }

  const sprintTitle = assignmentName.trim() || "Untitled sprint";

  return (
    <div className="app-bg py-5">
      <div className="container">
        <h1 className="mb-4">Start a new sprint</h1>
        <p className="mb-5 lead">
          Name the assignment, choose a focus window, and add a few short tasks you
          want to finish this session.
        </p>

        <div className="row">
          <div className="col-md-7 mb-4">
            {/* Assignment name */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Assignment or sprint name
              </label>
              <input
                type="text"
                className="form-control"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                placeholder="CS571 project milestone"
              />
            </div>

            {/* Focus window */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Focus window (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                className="form-control"
                value={focusMinutes}
                onChange={(e) => setFocusMinutes(Number(e.target.value) || 0)}
              />
            </div>

            {/* Short tasks */}
            <div className="mb-2">
              <label className="form-label fw-semibold">Add a short task</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  placeholder="Draft intro paragraph"
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddTask}
                >
                  Add
                </button>
              </div>
              <small className="text-muted">
                Keep tasks small so they feel easy to start.
              </small>
            </div>
          </div>

          {/* Preview column */}
          <div className="col-md-5">
            <div className="card bg-dark border-0 text-light">
              <div className="card-body">
                <h2 className="h4 mb-3">Sprint preview</h2>
                <p className="mb-1">
                  <span className="fw-semibold">Title:</span> {sprintTitle}
                </p>
                <p className="mb-3">
                  <span className="fw-semibold">Focus window:</span>{" "}
                  {focusMinutes || 0} minutes
                </p>

                <p className="fw-semibold mb-2">Tasks:</p>
                {tasks.length === 0 ? (
                  <p className="text-secondary mb-0">
                    Add three to five small tasks to keep the sprint manageable.
                  </p>
                ) : (
                  <ul className="mb-0">
                    {tasks.map((task, idx) => (
                      <li key={idx}>{task}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewSprintPage;
