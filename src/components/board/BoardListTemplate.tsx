import { useState, useEffect, useRef } from 'react';
import BoardCard, { type BoardItem } from './BoardCard';

interface BoardListTemplateProps {
  category: string; 
  items: BoardItem[];
  isLoading?: boolean;
  hasNext?: boolean;
  totalCount?: number;
  onLoadMore: () => void;
}

export default function BoardListTemplate({ 
  category, 
  items, 
  isLoading = false,
  hasNext = false,
  totalCount = 0,
  onLoadMore
}: BoardListTemplateProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const observerRef = useRef<HTMLDivElement | null>(null);
  
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNext, isLoading, onLoadMore]);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-12 pb-20 bg-[#f4f5f7] font-sans">

      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-8 flex items-center h-[54px]">
        <svg className="w-5 h-5 text-gray-400 mr-2 ml-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text" 
          placeholder="검색어를 입력하세요 (제목, 주최자)" 
          className="w-full outline-none text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 h-auto sm:h-10 text-sm text-gray-600">
        <span className="font-medium">
          전체 검색결과 <span className="text-orange-500 font-bold">{totalCount}</span>건
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-start">
        {filteredItems.map(item => (
          <BoardCard key={item.id} item={item} basePath={`/board/${category}`} />
        ))}

        {isLoading && Array.from({ length: 4 }).map((_, index) => (
          <div 
            key={`skeleton-${index}`} 
            className="w-full h-[320px] bg-gray-200 rounded-xl animate-pulse" 
          />
        ))}
      </div>

      {!isLoading && items.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          게시글이 존재하지 않습니다.
        </div>
      )}

      <div ref={observerRef} className="h-10 w-full mt-4" />
    </div>
  );
}