import { Modal } from "../../../shared/components/Modal";

export function DrillDownModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <Modal title={title} onClose={onClose}>{children}</Modal>;
}
