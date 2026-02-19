'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    const pages: number[] = [];

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pages.push(i);
        }
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pages.map((page, index) => {
                const prevPage = pages[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                    <div key={page} className="flex items-center gap-2">
                        {showEllipsis && (
                            <span className="px-2 text-gray-500">...</span>
                        )}
                        <button
                            onClick={() => handlePageChange(page)}
                            className={cn(
                                'h-8 w-8 rounded-lg text-sm font-medium transition-colors',
                                page === currentPage
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            )}
                        >
                            {page}
                        </button>
                    </div>
                );
            })}

            <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}