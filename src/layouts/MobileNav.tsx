import { Menu } from "lucide-react";

export function MobileNav({ onOpen }: { onOpen: () => void }) {
  return <button className="icon-button mobile-only" onClick={onOpen} title="Open navigation"><Menu size={19} /></button>;
}
