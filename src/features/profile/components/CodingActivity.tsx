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
    if (count === 0) return 'bg-slate-100';
    if (count <= 2) return 'bg-blue-200';
    if (count <= 4) return 'bg-blue-400';
    return 'bg-blue-600';
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full"> 
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-900">Coding Activity</h3>
        <span className="text-xs font-medium text-slate-400">Last 3 months</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {loading 
          ? Array.from({ length: 90 }).map((_, i) => (
              <div key={`skel-${i}`} className="w-4 h-4 rounded-sm bg-slate-100 animate-pulse" />
            ))
          : activityData.map((day, index) => (
              <div
                key={index}
                title={`${day.date}: ${day.count} activities`}
                className={`w-4 h-4 rounded-sm ${getColorClass(day.count)} transition-all hover:ring-2 hover:ring-slate-300 cursor-help`}
              />
            ))
        }
      </div>
    </div>
  );
};
