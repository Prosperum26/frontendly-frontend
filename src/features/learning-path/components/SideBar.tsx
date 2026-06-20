import React, { useState, useEffect } from "react";
import { Flame, Trophy, Plus, Star, Zap, Sun } from "lucide-react";
import api from "../../../services/api";
import "./SideBar.css";
import { useAuthStore } from "../../../store/auth.store";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";

import type { UserData, ProgressResponse, Badge } from "../types/apiResponses";

interface MeApiData {
  name?: string;
  username?: string;
  avatarUrl?: string;
  xp?: number;
  level?: number;
  role?: string;
}

interface BadgesApiData {
  earned?: Array<{ id: string; name: string; icon: string }>;
  unearned?: Array<{ id: string; name: string; icon: string }>;
  badges?: Badge[];
}

interface SideBarProps {
  className?: string;
}

export const SideBar: React.FC<SideBarProps> = ({ className = "" }) => {
  const { isAuthenticated } = useAuthStore();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [progressData, setProgressData] = useState<ProgressResponse | null>(
    null,
  );
  const [badgesData, setBadgesData] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(() => isAuthenticated);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [userRes, progressRes, badgesRes] = await Promise.all([
          api.get<{ success: boolean; data: MeApiData }>("/users/me"),
          api.get<{ success: boolean; data: ProgressResponse }>("/users/progress"),
          api.get<{ success: boolean; data: Badge[] | BadgesApiData }>("/users/badges"),
        ]);

        const rawUser = userRes?.data?.data ?? {};
        setUserData({
          id: "",
          name: rawUser.name || rawUser.username || "",
          avatarUrl: rawUser.avatarUrl || "",
          totalXp: rawUser.xp ?? 0,
          currentLevel: rawUser.level ?? 1,
          userTitle: rawUser.role === "user" ? "Frontend Student" : "Frontend Master",
        });

        const pData = progressRes?.data?.data ?? {} as ProgressResponse;
        setProgressData(pData);

        const badgesRaw = badgesRes?.data?.data;
        let bData: Badge[] = [];
        if (Array.isArray(badgesRaw)) {
          bData = badgesRaw;
        } else if (badgesRaw?.earned || badgesRaw?.unearned) {
          bData = [
            ...(badgesRaw.earned ?? []).map((badge) => ({
              id: badge.id,
              name: badge.name,
              icon: badge.icon,
              isUnlocked: true,
            })),
            ...(badgesRaw.unearned ?? []).map((badge) => ({
              id: badge.id,
              name: badge.name,
              icon: badge.icon,
              isUnlocked: false,
            })),
          ];
        } else {
          bData = badgesRaw?.badges ?? [];
        }
        setBadgesData(bData);
      } catch (err: unknown) {
        const e = err as { response?: { status?: number }; message?: string };
        if (e?.response?.status === 401) {
          setError("Unauthenticated – please log in.");
        } else {
          console.error("Error fetching sidebar user details:", err);
          setError(e?.message ?? "Failed to load user info");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [isAuthenticated]);

  const renderBadge = (badge: Badge, index: number) => {
    const { name, icon, isUnlocked } = badge;
    const iconElement = (() => {
      switch (icon) {
        case "zap":
          return <Zap size={16} fill="#2563eb" color="#2563eb" />;
        case "sun":
          return <Sun size={16} fill="#d97706" color="#d97706" />;
        default:
          return name;
      }
    })();
    const badgeClass = isUnlocked
      ? "badge-icon bg-blue-light text-blue"
      : "badge-icon bg-gray-200 text-gray-500 grayscale opacity-50";
    return (
      <div key={index} className={badgeClass} title={name}>
        {iconElement}
      </div>
    );
  };

  const displayName = userData?.name;
  const userTitle = userData?.userTitle;
  const avatarUrl = userData?.avatarUrl || DEFAULT_AVATAR;

  const currentXp = progressData?.xp ?? 0;
  const maxXp = progressData?.xpToNextLevel ?? 0;
  const xpPercentage = maxXp
    ? Math.min(100, Math.max(0, Math.round((currentXp / maxXp) * 100)))
    : 0;

  const streakText =
    typeof progressData?.streak === "number"
      ? `${progressData.streak} Days`
      : (progressData?.streak ?? "-");
  const rankText =
    typeof progressData?.rank === "number"
      ? `Top ${progressData.rank}%`
      : (progressData?.rank ?? "-");

  return (
    <aside className={`sidebar ${className}`}>
      <div className="progress-section">
        <h4 className="progress-section-title">YOUR PROGRESS</h4>
        <div className="progress-card">
          {isLoading ? (
            <div
              style={{
                padding: "20px 0",
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              Loading user progress…
            </div>
          ) : !isAuthenticated ? (
            <div
              style={{
                padding: "20px 0",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Đăng nhập để xem tiến trình học tập của bạn
            </div>
          ) : error ? (
            <div
              style={{
                padding: "20px 0",
                textAlign: "center",
                color: "#ef4444",
              }}
            >
              {error}
            </div>
          ) : (
            <>
              <div className="profile-info">
                <div className="avatar-wrapper">
                  <img src={avatarUrl} alt={displayName} className="avatar" />
                  <div className="level-badge">
                    <Star size={10} fill="white" stroke="white" />
                  </div>
                </div>
                <div>
                  <h3 className="user-name">{displayName}</h3>
                  <p className="user-title">{userTitle}</p>
                </div>
              </div>

              <div className="xp-container">
                <div className="xp-header">
                  <span className="xp-label">EXPERIENCE POINTS</span>
                  <span className="xp-value">
                    <strong>{currentXp.toLocaleString()}</strong> /{" "}
                    {maxXp.toLocaleString()}
                  </span>
                </div>
                <div className="xp-track">
                  <div
                    className="xp-fill"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-label">STREAK</span>
                  <div className="stat-value text-blue">
                    <Flame size={20} fill="#2563eb" color="#2563eb" />
                    <span>{streakText}</span>
                  </div>
                </div>
                <div className="stat-box">
                  <span className="stat-label">RANK</span>
                  <div className="stat-value text-blue">
                    <Trophy size={20} fill="#2563eb" color="#2563eb" />
                    <span>{rankText}</span>
                  </div>
                </div>
              </div>

              <div className="badges-section">
                <span className="stat-label">Badges Earned</span>
                <div className="badges-list">
                  {badgesData.map((badge, idx) => renderBadge(badge, idx))}
                  <div className="badge-empty">
                    <Plus size={16} color="#94a3b8" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
