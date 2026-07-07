import { useEffect, useState } from 'react';
import { profileService } from '../services/profile.service';

interface ActivityDay {
  date: string;
  count: number;
}

export const CodingActivity = () => {
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const dataArray = await profileService.fetchActivityStats();
        const last90Days: ActivityDay[] = [];

        for (let i = 89; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateString = d.toISOString().split('T')[0];
          const existingData = dataArray.find((item) => item.date === dateString);

          last90Days.push({
            date: dateString,
            count: existingData ? existingData.count : 0,
          });
        }
        setActivityData(last90Days);
      } catch {
        console.error('Lỗi tải dữ liệu activity');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-gray-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700';
    if (count <= 2) return 'bg-green-200 dark:bg-green-900/40 border border-green-300 dark:border-green-800';
    if (count <= 4) return 'bg-green-400 dark:bg-green-700/60 border border-green-500 dark:border-green-600';
    return 'bg-green-600 dark:bg-syntax-green border border-green-700 dark:border-green-400';
  };

  return (
    <div className="flex flex-col justify-between h-full"> 
      <div className="flex flex-wrap gap-1.5">
        {loading 
          ? Array.from({ length: 90 }).map((_, i) => (
              <div key={`skel-${i}`} className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))
          : activityData.map((day, index) => (
              <div
                key={index}
                title={`${day.date}: ${day.count} activities`}
                className={`cursor-pointer  w-4 h-4 rounded-sm ${getColorClass(day.count)} transition-all hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600`}
              />
            ))
        }
      </div>
    </div>
  );
};
