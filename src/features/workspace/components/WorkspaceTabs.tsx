export function WorkspaceTabs({ selected, onSelect }: { selected: string; onSelect: (tab: string) => void }) {
  return (
    <div className="tab-row">
      {["bookmarks", "saved-charts"].map((tab) => (
        <button key={tab} className={selected === tab ? "selected" : ""} onClick={() => onSelect(tab)}>{tab}</button>
      ))}
    </div>
  );
}
