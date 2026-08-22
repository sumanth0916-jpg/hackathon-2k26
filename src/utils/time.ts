/**
 * Calculates time compatibility score between lost and found event timestamps
 * Found items should typically be reported around the same time or after the lost item was lost
 */
export function calculateTimeScore(
  lostDate: string,
  lostTime: string,
  foundDate: string,
  foundTime: string
): number {
  try {
    const lostDt = new Date(`${lostDate}T${lostTime || '12:00'}:00`).getTime();
    const foundDt = new Date(`${foundDate}T${foundTime || '12:00'}:00`).getTime();

    if (isNaN(lostDt) || isNaN(foundDt)) return 0.5;

    const diffHours = (foundDt - lostDt) / (1000 * 60 * 60);

    // Found within 24 hours of losing (ideal)
    if (diffHours >= -2 && diffHours <= 24) return 1.0;
    // Found within 3 days
    if (diffHours >= -6 && diffHours <= 72) return 0.9;
    // Found within 7 days
    if (diffHours >= -12 && diffHours <= 168) return 0.75;
    // Found within 14 days
    if (diffHours >= -24 && diffHours <= 336) return 0.6;
    // Found within 30 days
    if (Math.abs(diffHours) <= 720) return 0.4;

    return 0.2;
  } catch {
    return 0.5;
  }
}

/**
 * Returns formatted relative time string e.g. "10 mins ago", "2 hours ago", "Yesterday", "3 days ago"
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    if (diffSecs < 172800) return 'Yesterday';
    if (diffSecs < 604800) return `${Math.floor(diffSecs / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return dateString;
  }
}

export function formatDatePretty(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}
