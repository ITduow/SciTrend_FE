import { Modal } from "./Modal";

export function ConfirmDialog({
  title,
  message,
  onCancel,
  onConfirm
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p>{message}</p>
      <div className="filter-row">
        <button className="icon-text" onClick={onCancel}>Cancel</button>
        <button className="primary-button" onClick={onConfirm}>Confirm</button>
      </div>
    </Modal>
  );
}
