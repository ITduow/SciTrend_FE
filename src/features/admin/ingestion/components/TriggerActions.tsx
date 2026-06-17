export function TriggerActions({ onCrawler, onExtraction }: { onCrawler: () => void; onExtraction: () => void }) {
  return <div className="filter-row"><button className="icon-text" onClick={onCrawler}>Crawler</button><button className="icon-text" onClick={onExtraction}>Extract Keywords</button></div>;
}
