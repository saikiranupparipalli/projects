import { getTodayISOString } from './dates';

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Complete high-priority project deliverable',
    description: 'Finish the technical specifications and review component architecture with the team.',
    completed: false,
    priority: 'urgent', // low, medium, high, urgent
    dueDate: getTodayISOString(),
    dueTime: '16:00',
    starred: true,
    tags: ['work', 'spec', 'urgent'],
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-1-1', title: 'Draft schema architecture', completed: true },
      { id: 'sub-1-2', title: 'Write API endpoints overview', completed: false },
      { id: 'sub-1-3', title: 'Schedule peer code review', completed: false }
    ]
  },
  {
    id: 'task-2',
    title: '30-minute afternoon workout & stretch',
    description: 'Core cardio session followed by 10 minutes of hamstring and back stretches.',
    completed: false,
    priority: 'high',
    dueDate: getTodayISOString(),
    dueTime: '17:30',
    starred: false,
    tags: ['fitness', 'routine'],
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-2-1', title: '15 min Jump rope & high knees', completed: true },
      { id: 'sub-2-2', title: 'Bodyweight squats & pushups', completed: false }
    ]
  },
  {
    id: 'task-3',
    title: 'Read 2 chapters of "Atomic Habits"',
    description: 'Focus on chapter 4 & 5 regarding habit stacking and environmental cues.',
    completed: true,
    priority: 'medium',
    dueDate: getTodayISOString(),
    dueTime: '',
    starred: true,
    tags: ['reading', 'growth'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    subtasks: []
  },
  {
    id: 'task-4',
    title: 'Weekly grocery list & meal prep',
    description: 'Stock up on fresh spinach, avocados, chicken breast, oats, and almond milk.',
    completed: false,
    priority: 'low',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '10:00',
    starred: false,
    tags: ['groceries'],
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-4-1', title: 'Fresh vegetables & greens', completed: true },
      { id: 'sub-4-2', title: 'Protein sources & Greek yogurt', completed: false },
      { id: 'sub-4-3', title: 'Nuts & whole grain oats', completed: false }
    ]
  }
];

export const INITIAL_SETTINGS = {
  theme: 'dark',
  soundEnabled: true,
  autoDeleteCompleted: false,
  compactView: false,
  showStreakBanner: true
};

export const INITIAL_STATS = {
  streakCount: 0,
  lastCompletedDate: '',
  totalCompletedCount: 0
};

export function loadStoredData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Error loading key ${key} from storage:`, err);
    return fallback;
  }
}

export function saveStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key} to storage:`, err);
  }
}
