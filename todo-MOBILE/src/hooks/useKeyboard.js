import { useEffect } from 'react';

export function useKeyboard(shortcuts = {}) {
  useEffect(() => {
    function handleKeyDown(event) {
      // Don't trigger if target is an input, textarea, or contenteditable
      const target = event.target;
      const isInput = target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' || 
                      target.tagName === 'SELECT' || 
                      target.isContentEditable;

      if (event.key === 'Escape') {
        if (shortcuts.onEscape) shortcuts.onEscape();
        return;
      }

      if (isInput) return;

      if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        if (shortcuts.onFocusSearch) shortcuts.onFocusSearch();
      } else if (event.key.toLowerCase() === 'n' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        if (shortcuts.onNewTask) shortcuts.onNewTask();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
