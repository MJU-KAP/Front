import { useEffect, useState, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchBoardItems } from '../../apis/crawl';
import BoardListTemplate from '../../components/board/BoardListTemplate';
import { type BoardItem } from '../../components/board/BoardCard';

export default function BoardPage() {
  const { category } = useParams<{ category: string }>();
  
  const [items, setItems] = useState<BoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  let targetCategory = '';
  if (category === 'activities') { targetCategory = 'activity'; } 
  else if (category === 'competitions') { targetCategory = 'contest'; } 
  else if (category === 'clubs') { targetCategory = 'club'; }

  const loadData = useCallback(async (currentPage: number, isInitial: boolean = false) => {
    if (!targetCategory) return;
    
    setIsLoading(true);
    try {
      const result = await fetchBoardItems(targetCategory, currentPage, 30);
      
      setItems((prev) => (isInitial ? result.items : [...prev, ...result.items]));
      setHasNext(result.hasNext);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [targetCategory]);

  useEffect(() => {
    if (!targetCategory) return;
    
    setPage(1);
    loadData(1, true);
  }, [category, targetCategory, loadData]);

  const handleLoadMore = useCallback(() => {
    if (hasNext && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, false);
    }
  }, [hasNext, isLoading, page, loadData]);

  if (category !== 'activities' && category !== 'competitions' && category !== 'clubs') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <BoardListTemplate 
        category={category} 
        items={items} 
        isLoading={isLoading} 
        hasNext={hasNext}
        totalCount={totalCount}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}