interface PaginationProps {
  page: number;
  totalPages: number;
  filteredLength: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  grad: string;
}

export function Pagination({ page, totalPages, filteredLength, rowsPerPage, onPageChange, grad }: PaginationProps) {
  const start = Math.min((page - 1) * rowsPerPage + 1, filteredLength);
  const end = Math.min(page * rowsPerPage, filteredLength);
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  
  return (
    <div className="py-3.5 px-5 flex items-center justify-between flex-wrap gap-2.5 border-t border-slate-100">
      <span className="text-slate-400 text-xs">
        Showing {start}–{end} of {filteredLength} entries
      </span>
      <div className="flex gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className={`px-3 py-1 rounded-lg text-xs transition-all ${page === 1 ? "text-slate-300 cursor-default" : "text-slate-700 hover:bg-slate-100"}`}
          style={page !== 1 ? { background: "#fff", border: "1px solid #e2e8f0" } : {}}
        >
          ← Prev
        </button>
        
        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="px-2.5 py-1 rounded-lg text-xs transition-all"
            style={p === page ? { background: grad, color: "#fff", border: "none" } : { background: "#fff", border: "1px solid #e2e8f0", color: "#374151" }}
          >
            {p}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className={`px-3 py-1 rounded-lg text-xs transition-all ${page === totalPages ? "text-slate-300 cursor-default" : "text-slate-700 hover:bg-slate-100"}`}
          style={page !== totalPages ? { background: "#fff", border: "1px solid #e2e8f0" } : {}}
        >
          Next →
        </button>
      </div>
    </div>
  );
}