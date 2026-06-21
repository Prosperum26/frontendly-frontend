import type { ChallengeExercise } from './challenge.types';

export const DUMMY_CHALLENGES: ChallengeExercise[] = [
  {
    id: 'challenge-1',
    title: 'Tạo một nút bấm động',
    description: 'Tạo một nút bấm thay đổi màu khi hover và có animation nhấn',
    difficulty: 'easy',
    tags: ['HTML', 'CSS', 'Animation'],
    previewImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
  },
  {
    id: 'challenge-2',
    title: 'Form đăng nhập đẹp',
    description: 'Tạo một form đăng nhập hiện đại với validation cơ bản',
    difficulty: 'medium',
    tags: ['HTML', 'CSS', 'JavaScript'],
    previewImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
  },
  {
    id: 'challenge-3',
    title: 'Todo List React',
    description: 'Tạo một ứng dụng Todo List với React',
    difficulty: 'hard',
    tags: ['React', 'JSX', 'Hooks'],
    previewImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
  },
  {
    id: 'challenge-4',
    title: 'Layout Flexbox',
    description: 'Tạo một responsive layout sử dụng Flexbox',
    difficulty: 'easy',
    tags: ['HTML', 'CSS', 'Flexbox'],
    previewImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=300&fit=crop',
  },
  {
    id: 'challenge-5',
    title: 'Thực hiện API Fetch',
    description: 'Lấy dữ liệu từ API và hiển thị lên giao diện',
    difficulty: 'medium',
    tags: ['JavaScript', 'API', 'Fetch'],
    previewImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
  },
  {
    id: 'challenge-6',
    title: 'Card Component React',
    description: 'Tạo một component card có thể tái sử dụng',
    difficulty: 'medium',
    tags: ['React', 'JSX', 'Components'],
    previewImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
  },
];
