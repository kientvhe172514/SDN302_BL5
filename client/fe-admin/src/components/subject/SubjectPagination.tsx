"use client";

import { Button } from "@/components/ui/button";

interface SubjectPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function SubjectPagination({
  currentPage,
  totalPages,
  onPageChange,
}: SubjectPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Trước
      </Button>
      <span className="flex items-center px-4">
        Trang {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Sau
      </Button>
    </div>
  );
}
