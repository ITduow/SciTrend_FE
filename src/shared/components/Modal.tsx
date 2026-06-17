import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal-layer">
      <button className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
      <section className="modal">
        <div className="panel-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
