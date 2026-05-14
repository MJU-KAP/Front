import { Link } from 'react-router-dom';

export interface BoardItem {
  id: string | number;
  title: string;
  host: string;
  dDay: string;
  thumbnailUrl?: string;
  mainTags?: string[];
}

interface BoardCardProps {
  item: BoardItem;
  basePath: string;
}

export default function BoardCard({ item, basePath }: BoardCardProps) {
  return (
    <Link 
      to={`${basePath}/${item.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl uppercase tracking-widest bg-gray-200">Activity</div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-gray-500 mb-4">{item.host}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-bold text-orange-500">
            {item.dDay}
          </span>
          
          {/* 태그 영역: flex와 gap-1을 사용해 나란히 배치 */}
          <div className="flex gap-1">
            {item.mainTags?.map((tag) => (
              <span 
                key={tag}
                className="px-2.5 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full border border-orange-100/50 shadow-sm shadow-orange-500/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}