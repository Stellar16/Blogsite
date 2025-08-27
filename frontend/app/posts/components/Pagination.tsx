"use client";

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <nav>
      <ul className="pagination justify-content-center mt-3">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <li
            key={p}
            className={`page-item ${p === currentPage ? "active" : ""}`}
          >
            <a
              href="#"
              className="page-link"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(p);
              }}
            >
              {p}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
