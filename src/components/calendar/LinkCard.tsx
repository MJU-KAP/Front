import { motion } from 'framer-motion';
import type { StudyLink } from '../../types/calendar';

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

interface Props {
  link: StudyLink;
  index: number;
}

export default function LinkCard({ link, index }: Props) {
  const youtubeId = link.type === 'youtube' ? getYoutubeId(link.url) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl border border-zinc-100 overflow-hidden hover:border-zinc-200 transition-colors"
    >
      {/* 유튜브 embed */}
      {link.type === 'youtube' && youtubeId ? (
        <div>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={link.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="p-3 bg-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                YouTube
              </span>
            </div>
            <p className="text-xs font-bold text-zinc-800 line-clamp-2">{link.title}</p>
          </div>
        </div>
      ) : (
        /* 블로그 카드 */
        <button
          type="button"
          onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
          className="w-full p-4 bg-white flex items-start gap-3 text-left hover:bg-zinc-50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <span className="text-emerald-600 text-sm font-black">B</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                Blog
              </span>
            </div>
            <p className="text-xs font-bold text-zinc-800 line-clamp-2">{link.title}</p>
            <p className="text-[10px] text-zinc-400 mt-1 truncate">{link.url}</p>
          </div>
          <span className="text-zinc-300 text-xs shrink-0">→</span>
        </button>
      )}
    </motion.div>
  );
}