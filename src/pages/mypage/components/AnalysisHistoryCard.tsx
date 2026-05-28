import { Button } from '../../../components/ui/Button';
import type { AnalysisRecord } from '../../../types/mypage';
import { formatKoreanDate } from '../formatDate';

const TAG_STYLES = [
  'bg-zinc-100 text-zinc-700',
  'bg-orange-50 text-orange-700',
  'bg-sky-50 text-sky-700',
] as const;

type AnalysisHistoryCardProps = {
  record: AnalysisRecord;
  onDelete: (recordId: string) => void;
  isDeleting: boolean;
};

export default function AnalysisHistoryCard({
  record,
  onDelete,
  isDeleting,
}: AnalysisHistoryCardProps) {
  const metaParts = [formatKoreanDate(record.createdAt)];
  if (record.fileName) metaParts.push(record.fileName);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm shadow-zinc-900/5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold text-zinc-900 sm:text-lg">{record.inputSummary}</h3>
        <p className="mt-1.5 text-sm text-zinc-500">{metaParts.join(' · ')}</p>
        {record.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="관련 기술">
            {record.tags.map((tag, index) => (
              <li
                key={tag}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${TAG_STYLES[index % TAG_STYLES.length]}`}
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex shrink-0 gap-2 self-start sm:self-center">
        <Button variant="secondary" to={`/result/${record.recordId}`}>
          결과 보기
        </Button>
        <Button
          variant="secondary"
          onClick={() => onDelete(record.recordId)}
          disabled={isDeleting}
          className="border-red-200 text-red-700 hover:bg-red-50"
        >
          {isDeleting ? '삭제 중...' : '삭제'}
        </Button>
      </div>
    </article>
  );
}
