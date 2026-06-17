export function Pagination({ page, size, total, onPage }: { page: number; size: number; total: number; onPage: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / size));
  return (
    <div className="pagination">
      <span>{total.toLocaleString()} records</span>
      <button disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
      <strong>{page} / {pages}</strong>
      <button disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  );
}
