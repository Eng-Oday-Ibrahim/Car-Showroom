import Link   from 'next/link';
import { Button } from '../ui/button';
import { cn }     from '../../lib/utils';

interface PaginationProps {
  page:        number;
  totalPages:  number;
  buildHref:   (page: number) => string;   // للـ Server Components
  onPageChange?: (page: number) => void;   // للـ Client Components
}

export function Pagination({ page, totalPages, buildHref, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const currentPage = Number(page);
  const pageCount = Number(totalPages);

  // نعرض max 5 أرقام حول الصفحة الحالية
  const range = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    p => p === 1 || p === pageCount || Math.abs(p - currentPage) <= 2
  );

  // نضيف "..." بين الأرقام غير المتتالية
  const pages: (number | '...')[] = [];
  let prev = 0;
  for (const p of range) {
    if (p - prev > 1) pages.push('...');
    pages.push(p);
    prev = p;
  }

  const PageBtn = ({ p }: { p: number | '...' }) => {
    if (p === '...') {
      return <span className="px-2 text-gray-400 text-sm self-center">...</span>;
    }

    const isActive = p === currentPage;
    const content  = (
      <Button
        variant={isActive ? 'default' : 'outline'}
        size="sm"
        className={cn('min-w-[2.25rem]', isActive && 'pointer-events-none')}
        onClick={onPageChange ? () => onPageChange(p) : undefined}
      >
        {p}
      </Button>
    );

    return onPageChange
      ? content
      : <Link href={buildHref(p)}>{content}</Link>;
  };

  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      {/* السابق */}
      {onPageChange ? (
        <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          Previous
        </Button>
      ) : (
        currentPage > 1 ? (
          <Link href={buildHref(currentPage - 1)}>
            <Button variant="outline" size="sm">Previous</Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>Previous</Button>
        )
      )}

      {pages.map((p, i) => <PageBtn key={i} p={p} />)}

      {/* التالي */}
      {onPageChange ? (
        <Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => onPageChange(currentPage + 1)}>
          Next
        </Button>
      ) : (
        currentPage < pageCount ? (
          <Link href={buildHref(currentPage + 1)}>
            <Button variant="outline" size="sm">Next</Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>Next</Button>
        )
      )}
    </div>
  );
}
