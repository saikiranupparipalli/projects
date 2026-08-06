export function formatRelativeDate(dateString) {
  if (!dateString) return null;

  const targetDate = new Date(dateString);
  const now = new Date();

  // Reset time to start of day for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  const diffTime = targetDay.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  const hasTime = dateString.includes('T') || dateString.includes(':');
  const timeFormatted = hasTime ? targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  let label = '';
  let status = 'normal'; // normal, today, overdue, upcoming

  if (diffDays === 0) {
    label = 'Today';
    status = 'today';
  } else if (diffDays === 1) {
    label = 'Tomorrow';
    status = 'upcoming';
  } else if (diffDays === -1) {
    label = 'Yesterday';
    status = 'overdue';
  } else if (diffDays < -1) {
    label = `${Math.abs(diffDays)} days overdue`;
    status = 'overdue';
  } else if (diffDays <= 7) {
    label = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
    status = 'upcoming';
  } else {
    label = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    status = 'upcoming';
  }

  if (timeFormatted) {
    label += ` at ${timeFormatted}`;
  }

  return { label, status, diffDays };
}

export function getTodayISOString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function isSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}
