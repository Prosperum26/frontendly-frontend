import { AlertCircle } from 'lucide-react';

interface QuotaIndicatorProps {
  remainingQuota: number;
  dailyLimit: number;
  resetAt: Date;
}

export function QuotaIndicator({ remainingQuota, dailyLimit, resetAt }: QuotaIndicatorProps) {
  const isLow = remainingQuota <= 3;
  const isExhausted = remainingQuota === 0;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
        isExhausted
          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          : isLow
          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      }`}
    >
      {isExhausted && <AlertCircle className="w-4 h-4" />}
      <span>
        {isExhausted
          ? 'Daily quota exhausted'
          : `${remainingQuota}/${dailyLimit} messages remaining`}
      </span>
      {!isExhausted && (
        <span className="text-xs opacity-70">
          (Resets at {new Date(resetAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
        </span>
      )}
    </div>
  );
}
