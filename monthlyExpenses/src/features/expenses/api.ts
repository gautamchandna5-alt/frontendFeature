export interface Category {
  name: string;
  amount: number;
  color: string;
}

export interface MonthData {
  id: string;
  month: string;
  total: number;
  categories: Category[];
}

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
  "var(--color-chart-7)",
  "var(--color-chart-8)",
];

const randomizeAmount = (base: number) => {
  const variance = (Math.random() * 0.3) - 0.15; 
  return Math.round(base + (base * variance));
};

const generateCategories = (baseAmounts: number[]) => {
  const names = ["Rent", "BTech Tuition", "Groceries", "Utilities", "Transport", "Internet", "Dining Out", "Healthcare"];
  
  return names.map((name, i) => {
    const isFixed = name === "Rent" || name === "BTech Tuition";
    return {
      name,
      amount: isFixed ? baseAmounts[i] : randomizeAmount(baseAmounts[i]),
      color: COLORS[i]
    };
  });
};

// Cached Session Data
const SESSION_DATA: MonthData[] = [
  { id: "jan", month: "January", total: 0, categories: generateCategories([1200, 800, 450, 150, 120, 80, 200, 100]) },
  { id: "feb", month: "February", total: 0, categories: generateCategories([1200, 800, 420, 145, 110, 80, 150, 90]) },
  { id: "mar", month: "March", total: 0, categories: generateCategories([1200, 800, 500, 160, 140, 80, 250, 120]) },
  { id: "apr", month: "April", total: 0, categories: generateCategories([1200, 800, 480, 150, 130, 80, 180, 80]) }
].map(month => ({
  ...month,
  total: month.categories.reduce((sum, cat) => sum + cat.amount, 0)
}));

export const fetchExpenses = async (): Promise<MonthData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(SESSION_DATA), 600); 
  });
};