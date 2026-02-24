/**
 * Date utilities for pain tracker
 */

export function getTodayString(): string {
  const today = new Date();
  return formatDateToISO(today);
}

export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getDateNDaysAgo(n: number): string {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return formatDateToISO(date);
}

export function calculatePeriodBounds(period: 'week' | 'month'): {
  startDate: string;
  endDate: string;
} {
  const endDate = new Date();
  const startDate = new Date();

  if (period === 'week') {
    startDate.setDate(endDate.getDate() - 6); // Last 7 days including today
  } else {
    startDate.setDate(endDate.getDate() - 29); // Last 30 days including today
  }

  return {
    startDate: formatDateToISO(startDate),
    endDate: formatDateToISO(endDate),
  };
}

export function isValidDate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    return false;
  }

  const date = parseISODate(dateStr);
  return !isNaN(date.getTime());
}

export function isDateInPast(dateStr: string): boolean {
  const date = parseISODate(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayString();
}

export function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = parseISODate(startDate);
  const end = parseISODate(endDate);

  while (current <= end) {
    dates.push(formatDateToISO(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function getReadableDate(dateStr: string): string {
  const date = parseISODate(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
