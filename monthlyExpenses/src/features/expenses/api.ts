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
  "#3B82F6", // blue
  "#10B981", // emerald
  "#F59E0B", // amber
  "#8B5CF6", // violet
  "#EF4444", // red
  "#06B6D4", // cyan
  "#D946EF", // fuchsia
  "#84CC16", // lime
];

// Helper to calculate perfect totals
const calculateTotal = (categories: Omit<Category, 'color'>[]) => 
  categories.reduce((sum, cat) => sum + cat.amount, 0);

const generateCategories = (amounts: number[]) => {
  const names = ["Rent", "Tuition", "Groceries", "Utilities", "Transport", "Internet", "Dining Out", "Healthcare"];
  return names.map((name, i) => ({
    name,
    amount: amounts[i],
    color: COLORS[i]
  }));
};

const EXPENSE_DATA: MonthData[] = [
  {
    id: "jan", month: "January", total: 0,
    categories: generateCategories([1200, 800, 450, 150, 120, 80, 200, 100])
  },
  {
    id: "feb", month: "February", total: 0,
    categories: generateCategories([1200, 800, 420, 145, 110, 80, 150, 90])
  },
  {
    id: "mar", month: "March", total: 0,
    categories: generateCategories([1200, 800, 500, 160, 140, 80, 250, 120])
  },
  {
    id: "apr", month: "April", total: 0,
    categories: generateCategories([1200, 800, 480, 150, 130, 80, 180, 80])
  }
].map(month => ({ ...month, total: calculateTotal(month.categories) }));

export const fetchExpenses = async (): Promise<MonthData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(EXPENSE_DATA), 400); // Faster initial load
  });
};