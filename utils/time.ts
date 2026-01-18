// utils/time.ts

export function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }
  
  export function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
  
  export function getWeekDates(fromDate: Date = new Date()) {
    const dates: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(fromDate);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  }
  
  export function getMonthDates(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }
  
  export function formatDateISO(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  export function isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
  
  export function getDaysAgo(date: Date): number {
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }