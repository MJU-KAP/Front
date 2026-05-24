import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchBoardDetail } from '../../apis/crawl';
import BoardDetailTemplate, { type BoardDetailData } from '../../components/board/BoardDetailTemplate';

export default function BoardDetailPage() {
  const { category, id } = useParams<{ category: string; id: string }>();
  const [detailData, setDetailData] = useState<BoardDetailData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!id || !category) return;

    let targetCategory = '';
    if (category === 'activities') { targetCategory = 'activity'; } 
    else if (category === 'competitions') { targetCategory = 'contest'; } 
    else if (category === 'clubs') { targetCategory = 'club'; }

    if (!targetCategory) return;

    const loadDetail = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBoardDetail(id, targetCategory);
        if (data) setDetailData(data);
      } catch (error) {
        console.error('상세 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetail();
  }, [id, category]);

  if (category !== 'activities' && category !== 'competitions' && category !== 'clubs') {
    return <Navigate to="/" replace />;
  }

  if (!isLoading && !detailData) {
    return <Navigate to={`/board/${category}`} replace />;
  }

  return (
    <BoardDetailTemplate category={category} data={detailData} />
  );
}