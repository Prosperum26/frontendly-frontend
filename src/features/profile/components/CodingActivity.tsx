import { useEffect, useState, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { profileService } from '../services/profile.service';
import type { ActivityLog } from '../types/profile.types';

interface ActivityDay {
  date: string;
  count: number;
}

interface HourlyActivity {
  hour: number;
  count: number;
  intensity: number;
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

export const ActivityClock = ({ activities }: { activities: ActivityLog[] }) => {
  const hourlyData = useMemo(() => {
    // Group activities by hour (0-23)
    const hourCounts = new Array(24).fill(0);
    activities.forEach((activity) => {
      const hour = new Date(activity.timestamp).getHours();
      hourCounts[hour]++;
    });

    const maxCount = Math.max(...hourCounts, 1);

    const data: HourlyActivity[] = hourCounts.map((count, hour) => ({
      hour,
      count,
      intensity: count / maxCount,
    }));

    return data;
  }, [activities]);

  const getOpacityForIntensity = (intensity: number) => {
    if (intensity === 0) return 0.1;
    return 0.3 + intensity * 0.7;
  };

  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Clock face */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-200 dark:text-slate-700" />

        {/* Hour segments */}
        {hourlyData.map((data) => {
          const angle = (data.hour * 15 - 90) * (Math.PI / 180);
          const nextAngle = ((data.hour + 1) * 15 - 90) * (Math.PI / 180);
          const x1 = 100 + 80 * Math.cos(angle);
          const y1 = 100 + 80 * Math.sin(angle);
          const x2 = 100 + 80 * Math.cos(nextAngle);
          const y2 = 100 + 80 * Math.sin(nextAngle);
          const opacity = getOpacityForIntensity(data.intensity);

          return (
            <g key={data.hour}>
              <path
                d={`M 100 100 L ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2} Z`}
                fill={data.count > 0 ? 'rgb(34, 197, 94)' : 'rgb(148, 163, 184)'}
                fillOpacity={opacity}
                className="transition-all hover:fill-opacity-100 cursor-pointer"
              />
              <title>{`${data.hour}:00 - ${data.count} activities`}</title>
            </g>
          );
        })}

        {/* Hour markers */}
        {[0, 6, 12, 18].map((hour) => {
          const angle = (hour * 15 - 90) * (Math.PI / 180);
          const x1 = 100 + 70 * Math.cos(angle);
          const y1 = 100 + 70 * Math.sin(angle);
          const x2 = 100 + 90 * Math.cos(angle);
          const y2 = 100 + 90 * Math.sin(angle);

          return (
            <line
              key={hour}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-400 dark:text-slate-600"
            />
          );
        })}

        {/* Center circle */}
        <circle cx="100" cy="100" r="15" fill="currentColor" className="text-slate-100 dark:bg-slate-800" />
      </svg>

      {/* Clock icon in center */}
      <Clock className="w-6 h-6 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Legend */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800" />
          <span>0</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-200 dark:bg-green-900/40" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-600 dark:bg-syntax-green" />
          <span>High</span>
        </div>
      </div>
    </div>
  );
};
