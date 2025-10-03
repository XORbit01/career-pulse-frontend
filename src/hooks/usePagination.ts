
interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const usePagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }: UsePaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    window.scrollTo(0, 0);
  };

  const getVisiblePages = () => {
    const maxVisible = 5;
    const pages = [];
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return {
    totalPages,
    handlePageChange,
    getVisiblePages,
    canGoPrevious: currentPage > 1,
    canGoNext: currentPage < totalPages,
  };
};
