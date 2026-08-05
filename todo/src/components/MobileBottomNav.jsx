import React from 'react';
import { ListTodo, Search, Plus, BarChart2, Menu } from 'lucide-react';

export function MobileBottomNav({
  currentFilter,
  setCurrentFilter,
  onOpenNewTaskModal,
  onOpenStats,
  onToggleMobileSidebar,
  onFocusSearch
}) {
  return (
    <div className="mobile-bottom-nav">
      <button
        onClick={() => setCurrentFilter('all')}
        className={`bottom-nav-item ${currentFilter === 'all' ? 'active' : ''}`}
        title="ls"
      >
        <ListTodo size={20} />
        <span className="bottom-nav-label">ls</span>
      </button>

      <button
        onClick={onFocusSearch}
        className="bottom-nav-item"
        title="Search Tasks"
      >
        <Search size={20} />
        <span className="bottom-nav-label">Search</span>
      </button>

      {/* Center Floating Action Button (FAB) */}
      <button
        onClick={onOpenNewTaskModal}
        className="bottom-nav-fab"
        title="New Task"
      >
        <Plus size={24} />
      </button>

      <button
        onClick={onOpenStats}
        className="bottom-nav-item"
        title="Analytics"
      >
        <BarChart2 size={20} />
        <span className="bottom-nav-label">Stats</span>
      </button>

      <button
        onClick={onToggleMobileSidebar}
        className="bottom-nav-item"
        title="Menu"
      >
        <Menu size={20} />
        <span className="bottom-nav-label">Menu</span>
      </button>
    </div>
  );
}
