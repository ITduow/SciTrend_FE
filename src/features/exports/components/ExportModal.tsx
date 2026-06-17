import { useState } from "react";
import { Modal } from "../../../shared/components/Modal";

export function ExportModal({ onClose, onCreate }: { onClose: () => void; onCreate: (format: string, query: unknown) => void }) {
  const [format, setFormat] = useState("csv");
  const [queryJson, setQueryJson] = useState('{"type":"articles","filters":{}}');
  return (
    <Modal title="Create Export" onClose={onClose}>
      <div className="form-stack">
        <label>Format<select value={format} onChange={(e) => setFormat(e.target.value)}><option value="csv">CSV</option><option value="xlsx">XLSX</option></select></label>
        <label>Query JSON<textarea value={queryJson} onChange={(e) => setQueryJson(e.target.value)} /></label>
        <button className="primary-button" onClick={() => onCreate(format, JSON.parse(queryJson))}>Create</button>
      </div>
    </Modal>
  );
}
