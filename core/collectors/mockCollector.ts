// core/collectors/mockCollector.ts

export type DailyMetrics = {
    date: string; // YYYY-MM-DD
    mentalScore: number;
    physicalScore: number;
    steps: number;
    sleepHours: number;
  };
  
  export function generateMockHistory(days = 14): DailyMetrics[] {
    const today = new Date();
  
    return Array.from({ length: days }).map((_, index) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (days - index));
  
      return {
        date: d.toISOString().slice(0, 10),
        mentalScore: 60 + Math.floor(Math.random() * 30),
        physicalScore: 55 + Math.floor(Math.random() * 35),
        steps: 4000 + Math.floor(Math.random() * 6000),
        sleepHours: Number((5 + Math.random() * 3).toFixed(1)),
      };
    });
  }
  