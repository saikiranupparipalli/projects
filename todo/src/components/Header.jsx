import React, { useState, useRef, useEffect } from 'react';
import { 
  ListTodo, Search, Sun, SlidersHorizontal, Volume2, VolumeX, 
  BarChart2, Flame, Settings, Plus, LogOut, Menu, X 
} from 'lucide-react';

export function Header({ 
  searchQuery, 
  setSearchQuery, 
  brightness = 100, 
  setBrightness, 
  soundEnabled, 
  setSoundEnabled, 
  streakCount = 0,
  onOpenStats,
  onOpenSettings,
  onOpenNewTaskModal,
  searchInputRef,
  currentUser,
  onLogout,
  isMobileSidebarOpen,
  onToggleMobileSidebar
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBrightnessPopover, setShowBrightnessPopover] = useState(false);

  const brightnessRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close brightness popover and user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (brightnessRef.current && !brightnessRef.current.contains(event.target)) {
        setShowBrightnessPopover(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="app-header glass-panel">
      {/* Brand & Mobile Hamburger Toggle */}
      <div className="header-brand">
        <button 
          onClick={onToggleMobileSidebar}
          className="mobile-menu-btn"
          title={isMobileSidebarOpen ? "Close navigation" : "Open navigation"}
        >
          {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="brand-icon">
          <ListTodo size={20} />
        </div>
        <div>
          <h1 className="brand-title">Backlogs</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="header-search">
        <Search size={15} className="search-icon-left" />
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder="Search backlogs... (/)"
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <kbd className="search-kbd">/</kbd>
      </div>

      {/* Header Actions & Controls */}
      <div className="header-actions">
        <button 
          onClick={onOpenNewTaskModal} 
          className="btn-primary"
          title="New Task (Press N)"
        >
          <Plus size={16} />
          <span className="btn-text">New Item</span>
        </button>

        {streakCount > 0 && (
          <div className="streak-badge" title={`${streakCount} day productivity streak!`}>
            <Flame size={16} />
            <span>{streakCount}d</span>
          </div>
        )}

        <button 
          onClick={onOpenStats} 
          className="icon-btn" 
          title="Productivity Dashboard"
        >
          <BarChart2 size={16} />
        </button>

        <button 
          onClick={() => setSoundEnabled && setSoundEnabled(!soundEnabled)} 
          className="icon-btn" 
          title={soundEnabled ? "Mute sound" : "Enable sound"}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Brightness Adjustment Button & Popover */}
        <div style={{ position: 'relative' }} ref={brightnessRef}>
          <button 
            onClick={() => setShowBrightnessPopover(!showBrightnessPopover)}
            className="icon-btn"
            title="Adjust Brightness (Max 110%)"
            style={{
              color: showBrightnessPopover ? 'var(--primary)' : 'var(--text-muted)',
              borderColor: showBrightnessPopover ? 'var(--primary)' : 'var(--border-color)'
            }}
          >
            <SlidersHorizontal size={16} />
          </button>

          {showBrightnessPopover && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '120%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 1rem',
              boxShadow: 'var(--glass-shadow)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              whiteSpace: 'nowrap'
            }}>
              <Sun size={15} style={{ color: 'var(--primary)' }} />
              <input 
                type="range"
                min="80"
                max="110"
                value={brightness}
                onChange={(e) => setBrightness && setBrightness(Number(e.target.value))}
                onMouseUp={() => setShowBrightnessPopover(false)}
                onTouchEnd={() => setShowBrightnessPopover(false)}
                className="brightness-range-input"
                style={{ width: '110px' }}
              />
              <span className="brightness-val-text">{brightness}%</span>
            </div>
          )}
        </div>

        <button 
          onClick={onOpenSettings} 
          className="icon-btn" 
          title="Settings"
        >
          <Settings size={16} />
        </button>

        {/* User Profile Avatar & Dropdown Menu */}
        {currentUser && (
          <div style={{ position: 'relative' }} ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9999px',
                background: 'var(--primary)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
              title={currentUser.name}
            >
              {getInitials(currentUser.name)}
            </button>

            {showUserMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                width: '200px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                boxShadow: 'var(--glass-shadow)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}>
                <div style={{ padding: '0.2rem 0.4rem' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
                </div>
                <div style={{ height: '1px', background: 'var(--border-color)' }} />
                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout && onLogout();
                  }}
                  className="btn-secondary"
                  style={{ justifyContent: 'flex-start', padding: '0.45rem 0.6rem', color: 'var(--priority-urgent)', border: 'none' }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}