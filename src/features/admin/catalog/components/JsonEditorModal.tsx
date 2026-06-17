import { useState } from "react";
import { Modal } from "../../../../shared/components/Modal";

export function JsonEditorModal({ initial = "{}", onClose, onSubmit }: { initial?: string; onClose: () => void; onSubmit: (payload: unknown) => void }) {
  const [json, setJson] = useState(initial);
  return <Modal title="JSON Editor" onClose={onClose}><textarea className="json-editor" value={json} onChange={(e) => setJson(e.target.value)} /><button className="primary-button" onClick={() => onSubmit(JSON.parse(json))}>Save</button></Modal>;
}
