import { useState } from "react";
import { getApiBaseUrl, setApiBaseUrl } from "../../../api/httpClient";

export function ApiSettings() {
  const [value, setValue] = useState(getApiBaseUrl());
  return <div className="form-stack"><label>Base URL<input value={value} onChange={(e) => setValue(e.target.value)} /></label><button className="primary-button" onClick={() => setApiBaseUrl(value)}>Save</button></div>;
}
