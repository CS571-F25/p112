import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SprintForm from "../components/SprintForm.jsx";

function CreateSprintPage({ onCreateSprint }) {
  const navigate = useNavigate();

  const handleCreate = (values) => {
    const newSprint = {
      id: `sprint-${Date.now()}`,
      title: values.title,
      course: values.course,
      dueDate: values.dueDate,
      focusMinutes: Number(values.focusMinutes) || 25,
      tasks: values.tasks.filter((t) => t && t.trim().length > 0),
      reflection: ""
    };

    onCreateSprint(newSprint);
    navigate(`/sprint/${newSprint.id}`);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Create a new sprint</Card.Title>
        <Card.Text>
          Describe the assignment, pick a focus window, and list a few small
          tasks to get started.
        </Card.Text>
        <SprintForm onSubmit={handleCreate} />
      </Card.Body>
    </Card>
  );
}

export default CreateSprintPage;
