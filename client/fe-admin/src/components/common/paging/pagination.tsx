"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationConfigProps {
  total: number;
  skip: number;
  limit: number;
  onPageChange: (newSkip: number) => void; // callback khi đổi page
}

export default function PaginationConfig({
  total,
  skip,
  limit,
  onPageChange,
}: PaginationConfigProps) {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  const handlePageClick = (page: number) => {
    onPageChange((page - 1) * limit);
  };

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) handlePageClick(currentPage - 1);
            }}
          />
        </PaginationItem>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(page);
              }} className={page === currentPage ? 'bg-green-100' : 'bg-gray-200'}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPages > 5 && <PaginationEllipsis />}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) handlePageClick(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
