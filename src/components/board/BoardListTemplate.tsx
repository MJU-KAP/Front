import { useState } from 'react';
import BoardCard, { type BoardItem } from './BoardCard';

interface BoardListTemplateProps {
  category: string; 
  items: BoardItem[];
  isLoading?: boolean;
}

type SortOption = 'latest' | 'deadline';

export default function BoardListTemplate({ category, items, isLoading = false }: BoardListTemplateProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          검색결과 <span className="text-orange-500 font-bold">{isLoading ? 0 : filteredItems.length}</span>건
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy('latest')}
            className={`w-[84px] py-1.5 rounded-full text-xs sm:text-sm text-center font-medium transition-colors duration-200 ${
              sortBy === 'latest'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 border border-orange-500'
                : 'bg-white text-gray-400 border border-gray-200 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            최신순
          </button>
          
          <button
            onClick={() => setSortBy('deadline')}
            className={`w-[84px] py-1.5 rounded-full text-xs sm:text-sm text-center font-medium transition-colors duration-200 ${
              sortBy === 'deadline'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 border border-orange-500'
                : 'bg-white text-gray-400 border border-gray-200 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            마감임박
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-start">
        {isLoading ? (
          /* 1. 로딩 중일 때 스켈레톤 UI (예: 8개 렌더링) */
          Array.from({ length: 8 }).map((_, index) => (
            <div 
              key={index} 
              className="w-full h-[320px] bg-gray-200 rounded-xl animate-pulse" 
            />
          ))
        ) : filteredItems.length > 0 ? (
          /* 2. 로딩 완료 및 데이터가 있을 때 */
          filteredItems.map(item => (
            <BoardCard key={item.id} item={item} basePath={`/board/${category}`} />
          ))
        ) : (
          /* 3. 로딩 완료 및 데이터가 없을 때 */
          <div className="col-span-full py-20 text-center text-gray-400">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}