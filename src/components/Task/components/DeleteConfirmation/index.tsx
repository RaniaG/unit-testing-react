import { Button, Modal } from "react-bootstrap";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}
export const DeleteConfirmation = ({ open, onConfirm, onClose }: Props) => {
  return (
    <Modal show={open} onHide={onClose} data-testid="modal">
      <Modal.Header closeButton>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete?</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          data-testid="cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          data-testid="confirm-button"
        >
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
