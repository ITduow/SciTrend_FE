import { useState } from "react";

export function BatchUploadBox({ onUpload }: { onUpload: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="filter-row align-end">
      <label className="wide">File<input type="file" accept=".csv,.xlsx,.xls,.json" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
      <button className="primary-button" onClick={() => file && onUpload(file)}>Upload</button>
    </div>
  );
}
