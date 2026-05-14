import { useEffect, useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchBoardItems } from '../../apis/crawl';
import BoardListTemplate from '../../components/board/BoardListTemplate';
import { type BoardItem } from '../../components/board/BoardCard';

export default function BoardPage() {
  const { category } = useParams<{ category: string }>();
  
  const [allBoardItems, setAllBoardItems] = useState<BoardItem[]>([]);
  const [displayedItems, setDisplayedItems] = useState<BoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const observerRef = useRef<HTMLDivElement | null>(null);

  let targetCategory = '';
  if (category === 'activities') { targetCategory = 'activity'; } 
  else if (category === 'competitions') { targetCategory = 'contest'; } 
  else if (category === 'clubs') { targetCategory = 'club'; }

  useEffect(() => {
    if (!targetCategory) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const items = await fetchBoardItems(targetCategory);
        setAllBoardItems(items);
        setDisplayedItems(items.slice(0, itemsPerPage));
        setPage(1);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [category, targetCategory]);

  useEffect(() => {
    if (allBoardItems.length > 0) {
      setDisplayedItems(allBoardItems.slice(0, page * itemsPerPage));
    }
  }, [page, allBoardItems]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && displayedItems.length < allBoardItems.length) {
        setPage((p) => p + 1);
      }
    }, { threshold: 0.5 });
    
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [displayedItems.length, allBoardItems.length]);

  if (category !== 'activities' && category !== 'competitions' && category !== 'clubs') {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <div className="max-w-6xl mx-auto p-6 bg-[#f4f5f7] min-h-screen">데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <BoardListTemplate category={category} items={displayedItems} />
      {displayedItems.length < allBoardItems.length && (
        <div ref={observerRef} className="w-full h-10" />
      )}
    </div>
  );
}