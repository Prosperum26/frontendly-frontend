import React, { useState } from "react";
import { motion } from "framer-motion";
import type { Badge as BadgeType } from "../types/profile.types";

interface BadgeProps {
  badge: BadgeType;
  size?: "sm" | "md" | "lg";
}

const getIconForBadge = (icon: string | undefined, size: number) => {
  const icons: Record<string, React.ReactNode> = {
    "🚀": (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C12 2 5 7 5 13C5 17 8 20 12 22C16 20 19 17 19 13C19 7 12 2 12 2Z" fill="#EF4444" />
        <path d="M12 6V14" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 9L15 9" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 22L9 24L12 20L15 24L12 22Z" fill="#FBBF24" />
      </svg>
    ),
    "🔥": (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C12 2 7 8 7 13C7 16 9 19 12 21C15 19 17 16 17 13C17 8 12 2 12 2Z" fill="#F97316" />
        <path d="M10 14C10 14 11 16 12 16C13 16 14 14 14 14C14 14 13 12 12 12C11 12 10 14 10 14Z" fill="#FBBF24" />
        <path d="M9 10C9 10 10.5 11 12 11C13.5 11 15 10 15 10C15 10 13.5 8 12 8C10.5 8 9 10 9 10Z" fill="#FEF3C7" />
      </svg>
    ),
    "📚": (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z"
          fill="#DBEAFE"
          stroke="#2563EB"
          strokeWidth="2"
        />
      </svg>
    ),
    "⭐": (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill="#FBBF24"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "🏆": (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 15L14.5 8.5L18 10L16.5 5L13 7L12 2L11 7L7.5 5L6 10L9.5 8.5L12 15Z"
          fill="#FBBF24"
          stroke="#F59E0B"
          strokeWidth="2"
        />
        <path d="M6 16H18V18H6V16Z" fill="#92400E" />
        <path d="M8 18H16L17 22H7L8 18Z" fill="#78350F" />
      </svg>
    ),
  };

  if (icon && icons[icon]) return icons[icon];

  return (
    <div
      style={{
        width: size,
        height: size,
        fontSize: size * 0.6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon || "🏆"}
    </div>
  );
};

const getUnlockConditionText = (badge: BadgeType) => {
  if (badge.description) return badge.description;
  return "Complete challenges to unlock this badge!";
};

export const Badge: React.FC<BadgeProps> = ({ badge, size = "md" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: { container: "w-8 h-8", inner: "w-7 h-7" },
    md: { container: "w-12 h-12", inner: "w-10 h-10" },
    lg: { container: "w-16 h-16", inner: "w-14 h-14" },
  };

  const iconSize = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  const isUnlocked = badge.earnedAt > 0;

  return (
    <div className="relative inline-block">
      <motion.div
        className={`${sizeClasses[size].container} flex items-center justify-center p-1 cursor-pointer transition-all duration-300`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.1, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className={`${sizeClasses[size].inner} rounded-full flex items-center justify-center transition-all duration-300 ${
            isUnlocked
              ? "bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg shadow-yellow-300/40 border border-yellow-300"
              : "bg-slate-100 grayscale opacity-50 border border-slate-200"
          }`}
        >
          {getIconForBadge(badge.icon, iconSize[size])}
        </div>
      </motion.div>

      {isHovered && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-48 p-3 bg-slate-800 text-white rounded-xl shadow-xl border border-slate-700">
          <p className="font-bold text-yellow-300 text-sm">{badge.name}</p>
          <p className="text-xs text-slate-300 mt-1">
            {getUnlockConditionText(badge)}
          </p>
          {isUnlocked && (
            <p className="text-xs text-emerald-400 mt-1 font-semibold">
              Earned on {new Date(badge.earnedAt).toLocaleDateString()}
            </p>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};
