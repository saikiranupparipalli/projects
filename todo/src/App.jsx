import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { StatsDashboard } from './components/StatsDashboard';
import { SettingsModal } from './components/SettingsModal';
import { LogsModal } from './components/LogsModal';
import { Toast } from './components/Toast';
import { AuthScreen } from './components/AuthScreen';
import { MobileBottomNav } from './components/MobileBottomNav';

import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeyboard } from './hooks/useKeyboard';
import { soundFx } from './utils/audio';
import { triggerTaskConfetti, triggerStreakCelebration } from './utils/confetti';
import { isSameDay, getTodayISOString, getGreeting } from './utils/dates';
import { INITIAL_TASKS, INITIAL_SETTINGS, INITIAL_STATS } from './utils/storage';
import { getCurrentUser, logoutUser } from './utils/auth';
import { api } from './utils/api';
import { loadStoredData, saveStoredData } from './utils/storage';

export function App() {
  // Authentication State (Requires MongoDB Atlas Login / Register)
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // Tasks & Settings States
  const [tasks, setTasks] = useState(() => {
    const user = getCurrentUser();
    if (user) {
      return loadStoredData(`backlogs_tasks_${user.id}`, []);
    }
    return [];
  });
  const [settings, setSettings] = useLocalStorage('backlogs_settings', {
    ...INITIAL_SETTINGS,
    brightness: 100
  });
  const [stats, setStats] = useLocalStorage('backlogs_stats', INITIAL_STATS);

  // Guarantee default streak count is 0
  useEffect(() => {
    if (stats && stats.streakCount === 3) {
      setStats({ ...stats, streakCount: 0 });
    }
  }, []);

  // Responsive Mobile Drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fetch tasks from MongoDB Backend when logged in, with offline/cache fallback
  useEffect(() => {
    async function loadBackendTasks() {
      if (currentUser) {
        // Load initial cached tasks
        const cached = loadStoredData(`backlogs_tasks_${currentUser.id}`, null);
        if (cached && Array.isArray(cached) && cached.length > 0) {
          setTasks(cached);
        }

        const res = await api.getTasks();
        if (res.success && Array.isArray(res.data)) {
          setTasks(res.data);
          saveStoredData(`backlogs_tasks_${currentUser.id}`, res.data);
        }
      }
    }
    loadBackendTasks();
  }, [currentUser]);

  // Helper to update tasks state and persistent cache simultaneously
  const updateTasks = (newTasksOrUpdater) => {
    setTasks((prevTasks) => {
      const nextTasks = typeof newTasksOrUpdater === 'function' ? newTasksOrUpdater(prevTasks) : newTasksOrUpdater;
      if (currentUser) {
        saveStoredData(`backlogs_tasks_${currentUser.id}`, nextTasks);
      }
      return nextTasks;
    });
  };

  // Active view filters
  const [currentFilter, setCurrentFilter] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');

  // Modals & UI States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const searchInputRef = useRef(null);
  const lastDeletedTaskRef = useRef(null);

  // Sound sync
  useEffect(() => {
    soundFx.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Real-time site brightness filter sync
  useEffect(() => {
    const level = settings.brightness || 100;
    document.documentElement.style.setProperty('--brightness-level', `${level}%`);
  }, [settings.brightness]);

  // Shortcuts
  useKeyboard({
    onFocusSearch: () => searchInputRef.current?.focus(),
    onNewTask: () => {
      setTaskToEdit(null);
      setModalInitialData(null);
      setIsTaskModalOpen(true);
    },
    onEscape: () => {
      setIsTaskModalOpen(false);
      setIsStatsOpen(false);
      setIsSettingsOpen(false);
      setIsLogsOpen(false);
      setIsMobileSidebarOpen(false);
    }
  });


  // Calculate task statistics
  const counts = useMemo(() => {
    const todayStr = getTodayISOString();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const c = { all: tasks.length, today: 0, upcoming: 0, important: 0, overdue: 0, completed: 0 };

    tasks.forEach((t) => {
      if (t.completed) {
        c.completed++;
      } else {
        if (t.starred) c.important++;
        if (t.dueDate) {
          const tDate = new Date(t.dueDate);
          const tDay = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate());
          if (isSameDay(t.dueDate, todayStr)) {
            c.today++;
          } else if (tDay < startOfToday) {
            c.overdue++;
          } else if (tDay > startOfToday) {
            c.upcoming++;
          }
        }
      }
    });

    return c;
  }, [tasks]);

  const allTags = useMemo(() => {
    const set = new Set();
    tasks.forEach((t) => {
      if (t.tags) t.tags.forEach((tag) => set.add(tag));
    });
    return Array.from(set);
  }, [tasks]);

  const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };

  const filteredTasks = useMemo(() => {
    const todayStr = getTodayISOString();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return tasks.filter((t) => {
      if (selectedTag) {
        if (!t.tags || !t.tags.includes(selectedTag)) return false;
      } else {
        if (currentFilter === 'today') {
          if (!t.dueDate || !isSameDay(t.dueDate, todayStr)) return false;
        } else if (currentFilter === 'upcoming') {
          if (!t.dueDate) return false;
          const tDate = new Date(t.dueDate);
          const tDay = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate());
          if (tDay <= startOfToday || t.completed) return false;
        } else if (currentFilter === 'important') {
          if (!t.starred) return false;
        } else if (currentFilter === 'overdue') {
          if (!t.dueDate || t.completed) return false;
          const tDate = new Date(t.dueDate);
          const tDay = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate());
          if (tDay >= startOfToday) return false;
        } else if (currentFilter === 'completed') {
          if (!t.completed) return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesTag = t.tags?.some((tag) => tag.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTag) return false;
      }

      return true;
    }).sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      if (sortBy === 'priority') {
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
    });
  }, [tasks, currentFilter, selectedTag, searchQuery, sortBy]);

  const viewTitle = useMemo(() => {
    if (selectedTag) return `Tag: #${selectedTag}`;
    const map = {
      all: 'ls',
      today: "Today's Logs",
      upcoming: 'Upcoming Logs',
      important: 'Important Items',
      overdue: 'Overdue Logs',
      completed: 'Completed Logs'
    };
    return map[currentFilter] || 'Logs';
  }, [currentFilter, selectedTag]);

  // CRUD Handlers
  const handleAddTask = async (newTaskData) => {
    const tempId = `task-${Date.now()}`;
    const tempTask = { id: tempId, createdAt: new Date().toISOString(), completed: false, ...newTaskData };
    updateTasks((prev) => [tempTask, ...prev]);
    soundFx.playAdd();

    const res = await api.createTask(newTaskData);
    if (res.success && res.data) {
      updateTasks((prev) => prev.map((t) => (t.id === tempId ? res.data : t)));
    }
    showToast('Log item created');
  };

  const handleUpdateTask = async (updatedData) => {
    if (updatedData.id) {
      updateTasks((prev) => prev.map((t) => (t.id === updatedData.id ? { ...t, ...updatedData } : t)));
      showToast('Log item updated');
      await api.updateTask(updatedData.id, updatedData);
    } else {
      handleAddTask(updatedData);
    }
  };

  const handleToggleComplete = async (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    const nextState = !target.completed;

    updateTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          if (nextState) {
            soundFx.playCheck();
            triggerTaskConfetti();
            updateStreakOnTaskComplete();
          } else {
            soundFx.playUncheck();
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );

    await api.updateTask(taskId, { completed: nextState });
  };

  const updateStreakOnTaskComplete = () => {
    const todayStr = getTodayISOString();
    if (stats.lastCompletedDate !== todayStr) {
      const nextStreak = stats.streakCount + 1;
      setStats({
        ...stats,
        streakCount: nextStreak,
        lastCompletedDate: todayStr,
        totalCompletedCount: stats.totalCompletedCount + 1
      });
      if (nextStreak % 3 === 0) {
        soundFx.playFanfare();
        triggerStreakCelebration();
      }
    }
  };

  const handleToggleStar = async (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    const nextStarred = !target.starred;

    updateTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, starred: nextStarred } : t)));
    await api.updateTask(taskId, { starred: nextStarred });
  };

  const handleToggleSubtask = async (taskId, subtaskId) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const updatedSubtasks = target.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );

    updateTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, subtasks: updatedSubtasks } : t))
    );

    await api.updateTask(taskId, { subtasks: updatedSubtasks });
  };

  const handleDuplicate = async (taskToDup) => {
    const dupData = {
      title: `${taskToDup.title} (Copy)`,
      description: taskToDup.description,
      priority: taskToDup.priority,
      dueDate: taskToDup.dueDate,
      dueTime: taskToDup.dueTime,
      starred: taskToDup.starred,
      tags: taskToDup.tags,
      subtasks: taskToDup.subtasks
    };
    handleAddTask(dupData);
  };

  const handleDelete = async (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    if (target) {
      lastDeletedTaskRef.current = target;
      updateTasks((prev) => prev.filter((t) => t.id !== taskId));
      soundFx.playDelete();
      showToast(`Deleted "${target.title.slice(0, 18)}..."`, true);
      await api.deleteTask(taskId);
    }
  };

  const handleUndoDelete = async () => {
    if (lastDeletedTaskRef.current) {
      const restored = lastDeletedTaskRef.current;
      updateTasks((prev) => [restored, ...prev]);
      lastDeletedTaskRef.current = null;
      setToast(null);
      await api.createTask(restored);
    }
  };

  const handleClearCompleted = async () => {
    updateTasks((prev) => prev.filter((t) => !t.completed));
    showToast('Cleared completed items');
    await api.clearCompleted();
  };

  const handleMarkAllCompleted = () => {
    const idsInView = new Set(filteredTasks.map((t) => t.id));
    updateTasks((prev) => prev.map((t) => (idsInView.has(t.id) ? { ...t, completed: true } : t)));
    soundFx.playFanfare();
    triggerTaskConfetti();
    showToast('Marked view items as done');
    filteredTasks.forEach((t) => api.updateTask(t.id, { completed: true }));
  };


  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const showToast = (message, hasUndo = false) => {
    setToast({ message, undoAction: hasUndo });
    setTimeout(() => setToast(null), 4000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `logs_${currentUser ? currentUser.name : 'export'}_${getTodayISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported logs to JSON');
  };

  const handleExportCSV = () => {
    let csv = 'Title,Status,Priority,Due Date,Tags\n';
    tasks.forEach((t) => {
      const title = `"${t.title.replace(/"/g, '""')}"`;
      const status = t.completed ? 'Completed' : 'Pending';
      const tags = `"${(t.tags || []).join(';')}"`;
      csv += `${title},${status},${t.priority},${t.dueDate || ''},${tags}\n`;
    });

    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `logs_export_${getTodayISOString()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported logs to CSV');
  };

  const handleImportJSON = async (importedTasks) => {
    setTasks(importedTasks);
    showToast(`Imported ${importedTasks.length} log items`);
    for (const t of importedTasks) {
      await api.createTask(t);
    }
  };

  const handleResetSampleData = () => {
    if (confirm('Reset to initial sample data?')) {
      setTasks(INITIAL_TASKS);
      showToast('Reset sample data');
    }
  };

  const handleClearAllData = async () => {
    if (confirm('Wipe ALL log items for your account?')) {
      setTasks([]);
      setStats({ streakCount: 0, lastCompletedDate: '', totalCompletedCount: 0 });
      showToast('Log data cleared');
      await api.clearCompleted();
    }
  };

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="app-container">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        brightness={settings.brightness || 100}
        setBrightness={(val) => setSettings({ ...settings, brightness: val })}
        soundEnabled={settings.soundEnabled}
        setSoundEnabled={(val) => setSettings({ ...settings, soundEnabled: val })}
        streakCount={stats.streakCount}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLogs={() => setIsLogsOpen(true)}
        onOpenNewTaskModal={() => {
          setTaskToEdit(null);
          setModalInitialData(null);
          setIsTaskModalOpen(true);
        }}
        searchInputRef={searchInputRef}
        currentUser={currentUser}
        onLogout={handleLogout}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="main-layout">
        {/* Responsive Mobile Overlay Backdrop */}
        {isMobileSidebarOpen && (
          <div 
            className="mobile-sidebar-overlay"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <div className={`sidebar-wrapper ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
          <Sidebar
            currentFilter={currentFilter}
            setCurrentFilter={(filter) => {
              setCurrentFilter(filter);
              setIsMobileSidebarOpen(false);
            }}
            selectedTag={selectedTag}
            setSelectedTag={(tag) => {
              setSelectedTag(tag);
              setIsMobileSidebarOpen(false);
            }}
            counts={counts}
            tags={allTags}
            onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
          />
        </div>

        <main className="content-area">
          <div className="dashboard-header">
            <div>
              <h2 className="greeting-text">{getGreeting()}, {currentUser.name.split(' ')[0]} 👋</h2>
              <p className="greeting-sub">
                You have <strong>{counts.today} logs</strong> in todays c inbox.
              </p>
            </div>
          </div>

          <TaskInput
            onAddTask={handleAddTask}
            onOpenFullModal={(initialVals) => {
              setTaskToEdit(null);
              setModalInitialData(initialVals);
              setIsTaskModalOpen(true);
            }}
          />

          <TaskList
            tasks={filteredTasks}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onToggleComplete={handleToggleComplete}
            onToggleStar={handleToggleStar}
            onEdit={(task) => {
              setTaskToEdit(task);
              setModalInitialData(null);
              setIsTaskModalOpen(true);
            }}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onToggleSubtask={handleToggleSubtask}
            onClearCompleted={handleClearCompleted}
            onMarkAllCompleted={handleMarkAllCompleted}
            viewTitle={viewTitle}
          />
        </main>
      </div>

      {/* Native Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentFilter={currentFilter}
        setCurrentFilter={(filter) => {
          setCurrentFilter(filter);
          setSelectedTag(null);
          setIsMobileSidebarOpen(false);
        }}
        onOpenNewTaskModal={() => {
          setTaskToEdit(null);
          setModalInitialData(null);
          setIsTaskModalOpen(true);
        }}
        onOpenStats={() => setIsStatsOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onFocusSearch={() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleUpdateTask}
        taskToEdit={taskToEdit}
        initialData={modalInitialData}
      />

      <StatsDashboard
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        tasks={tasks}
        stats={stats}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
        onExportJSON={handleExportJSON}
        onExportCSV={handleExportCSV}
        onImportJSON={handleImportJSON}
        onResetSampleData={handleResetSampleData}
        onClearAllData={handleClearAllData}
      />

      <LogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
      />

      <Toast
        toast={toast}
        onUndo={handleUndoDelete}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

