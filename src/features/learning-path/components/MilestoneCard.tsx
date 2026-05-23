import React from "react";
import type { Milestone } from "../types/learning-path.types";

interface MilestoneCardProps {
  milestone: Milestone;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
  const completedLessons = milestone.lessons.filter((l) => l.completed).length;
  const totalLessons = milestone.lessons.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const isInProgress = !milestone.completed && progressPercent > 0;

  return (
    <div
      className={`p-6 rounded-2xl border-2 mb-8 bg-[#C2C6D6] transition-all ${
        milestone.completed
          ? "border-emerald-500"
          : isInProgress
            ? "border-amber-400 shadow-xl"
            : "border-slate-100 opacity-60 grayscale-[0.3]"
      }`}
    >
      {/* Milestone Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl text-white ${milestone.completed}`}>
            {milestone.completed ? (
              <img src="/learning-path/completed_milestone.svg"></img>
            ) : isInProgress ? (
              <img src="/learning-path/InProgress_milestone.svg"></img>
            ) : (
              <img src="/learning-path/Locked_milestone.svg"></img>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Milestone {milestone.order}
              </span>
              {milestone.completed && (
                <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Completed
                </span>
              )}
              {isInProgress && (
                <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  In Progress
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              {milestone.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Thanh tiến độ */}
      {isInProgress && (
        <div className="mt-8 pt-5 border-t border-slate-50">
          <div className="flex justify-between text-[10px] font-black text-blue-600 mb-2 uppercase tracking-widest">
            <span>Progress to next Milestone</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
