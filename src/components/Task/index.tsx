import { useState } from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import { EditableTask } from "./components/EditableTask";
import "./index.css";
import { DeleteConfirmation } from "./components/DeleteConfirmation";
import * as api from "../../api";
import { Loading } from "../Loading";

interface Props {
  id: number;
  title: string;
  onChange: () => void;
}

export const Task = ({ id, title, onChange }: Props) => {
  const [editable, setEditable] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <Loading />}
      <Card>
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div className="title-container">
            {editable ? (
              <EditableTask
                id={id}
                title={title}
                onCancel={() => setEditable(false)}
                onEdit={() => {
                  setEditable(false);
                  onChange();
                }}
              />
            ) : (
              <span>{title ?? "New Task"}</span>
            )}
          </div>
          {!editable && (
            <ButtonGroup className="me-2" aria-label="First group">
              <Button
                variant="primary"
                className="edit-icon"
                onClick={() => setEditable(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M17.263 2.177a1.75 1.75 0 0 1 2.474 0l2.586 2.586a1.75 1.75 0 0 1 0 2.474L19.53 10.03l-.012.013L8.69 20.378a1.753 1.753 0 0 1-.699.409l-5.523 1.68a.748.748 0 0 1-.747-.188.748.748 0 0 1-.188-.747l1.673-5.5a1.75 1.75 0 0 1 .466-.756L14.476 4.963ZM4.708 16.361a.26.26 0 0 0-.067.108l-1.264 4.154 4.177-1.271a.253.253 0 0 0 .1-.059l10.273-9.806-2.94-2.939-10.279 9.813ZM19 8.44l2.263-2.262a.25.25 0 0 0 0-.354l-2.586-2.586a.25.25 0 0 0-.354 0L16.061 5.5Z"></path>
                </svg>
              </Button>
              <Button
                variant="primary"
                className="delete-icon"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M16 1.75V3h5.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75Zm-6.5 0V3h5V1.75a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25ZM4.997 6.178a.75.75 0 1 0-1.493.144L4.916 20.92a1.75 1.75 0 0 0 1.742 1.58h10.684a1.75 1.75 0 0 0 1.742-1.581l1.413-14.597a.75.75 0 0 0-1.494-.144l-1.412 14.596a.25.25 0 0 1-.249.226H6.658a.25.25 0 0 1-.249-.226L4.997 6.178Z"></path>
                  <path d="M9.206 7.501a.75.75 0 0 1 .793.705l.5 8.5A.75.75 0 1 1 9 16.794l-.5-8.5a.75.75 0 0 1 .705-.793Zm6.293.793A.75.75 0 1 0 14 8.206l-.5 8.5a.75.75 0 0 0 1.498.088l.5-8.5Z"></path>
                </svg>
              </Button>
            </ButtonGroup>
          )}
        </Card.Body>
      </Card>
      <DeleteConfirmation
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={() => {
          setShowDeleteConfirmation(false);
          setLoading(true);
          api
            .deleteTask(id)
            .then(onChange)
            .finally(() => setLoading(false));
        }}
      />
    </>
  );
};
