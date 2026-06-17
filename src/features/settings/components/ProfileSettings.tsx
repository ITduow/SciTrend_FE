import type { User } from "../../../types/auth.types";

export function ProfileSettings({ user }: { user: User }) {
  return <dl className="definition-list"><dt>User</dt><dd>{user.username}</dd><dt>Email</dt><dd>{user.email}</dd><dt>Role</dt><dd>{user.role}</dd></dl>;
}
