import { useState } from "react";
import { getApiBaseUrl, setApiBaseUrl } from "../../../api/httpClient";
import type { Notify } from "../../../app/app.types";
import type { User } from "../../../types/auth.types";
import { Panel } from "../../../shared/components/Panel";

export function SettingsPage({ auth, notify }: { auth: User; notify: Notify }) {
  const [apiBase, setBase] = useState(getApiBaseUrl());
  return (
    <div className="two-column">
      <Panel title="Profile">
        <dl className="definition-list">
          <dt>User</dt><dd>{auth.username}</dd>
          <dt>Email</dt><dd>{auth.email}</dd>
          <dt>Role</dt><dd>{auth.role}</dd>
        </dl>
      </Panel>
      <Panel title="API Gateway">
        <div className="form-stack">
          <label>Base URL<input value={apiBase} onChange={(e) => setBase(e.target.value)} /></label>
          <button className="primary-button" onClick={() => { setApiBaseUrl(apiBase); notify("Gateway URL saved.", "success"); }}>Save</button>
        </div>
      </Panel>
    </div>
  );
}
