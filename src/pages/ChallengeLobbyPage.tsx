import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ChallengeExercise } from '../features/challenge/types/challenge.types';
import challengeService from '../features/challenge/services/challenge.service';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Loader } from '../components/Loader';

export const ChallengeLobbyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<ChallengeExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load challenges from API
  useEffect(() => {
    const loadChallenges = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await challengeService.getChallenges();
        setChallenges(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load challenges');
      } finally {
        setIsLoading(false);
      }
    };
    loadChallenges();
  }, []);

  // Get all unique tags from challenges
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    challenges.forEach((challenge) => {
      challenge.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [challenges]);

  // Filter challenges
  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag ? challenge.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag, challenges]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 font-bold mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-heading mb-2">Challenge Lobby</h1>
          <p className="text-body text-sm sm:text-base md:text-lg">Luyện tập coding với các bài tập thực tế!</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <Input
            type="text"
            placeholder="Tìm kiếm bài tập..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          <Button
            variant={selectedTag === null ? 'primary' : 'secondary'}
            onClick={() => setSelectedTag(null)}
          >
            Tất cả
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'primary' : 'secondary'}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>

        {/* Empty State */}
        {filteredChallenges.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <h3 className="text-xl sm:text-2xl font-semibold text-heading mb-2">
              Không tìm thấy bài tập nào
            </h3>
            <p className="text-muted text-sm sm:text-base">
              Thay đổi từ khóa tìm kiếm hoặc tag để tìm bài tập phù hợp!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Challenge Card Component
interface ChallengeCardProps {
  challenge: ChallengeExercise;
}
const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  // Difficulty colors
  const difficultyColors: Record<ChallengeExercise['difficulty'], string> = {
    easy: 'bg-success-light dark:bg-success-darker/30 text-success-darker dark:text-success-light',
    medium: 'bg-warning-light dark:bg-warning/30 text-amber-800 dark:text-amber-200',
    hard: 'bg-red-100 dark:bg-red-900/30 text-error dark:text-red-400',
  };

  return (
    <Link to={`/workspace/${challenge.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Preview Image */}
        <div className="h-36 sm:h-48 overflow-hidden">
          <img
            src={challenge.previewImage}
            alt={challenge.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          {/* Difficulty Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${difficultyColors[challenge.difficulty]}`}>
              {challenge.difficulty}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-heading mb-2 line-clamp-2">
            {challenge.title}
          </h3>

          {/* Description */}
          <p className="text-body text-sm mb-4 line-clamp-2">
            {challenge.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {challenge.tags.map((tag, index) => (
              <span
                key={`${challenge.id}-${tag}-${index}`}
                className="text-xs bg-surface dark:bg-surface-raised text-muted px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ChallengeLobbyPage;
