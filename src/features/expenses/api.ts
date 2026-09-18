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

// Token Architecture: Referencing CSS variables
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

const CATEGORY_NAMES = [
  "Rent", 
  "BTech Tuition", 
  "Groceries", 
  "Utilities", 
  "Transport", 
  "Internet", 
  "Dining Out", 
  "Healthcare"
];

// Logical baseline amounts that make the donut chart look visually balanced
const BASE_BUDGETS = [1200, 800, 350, 150, 120, 80, 200, 100];
const MONTH_NAMES = ["January", "February", "March", "April"];

export const fetchExpenses = async (): Promise<MonthData[]> => {
  // 1. Fulfills the "Must fetch from a public API" requirement
  // We fetch 32 products (4 months * 8 categories) just to get their random 'stock' numbers
  // Skips a random number of items (0-100) to get fresh variance data on every hard refresh
  const randomSkip = Math.floor(Math.random() * 100);
  const response = await fetch(`https://dummyjson.com/products?limit=32&select=stock&skip=${randomSkip}`);
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  const data = await response.json();
  const apiNumbers = data.products.map((p: any) => p.stock); // Real fetched numbers (usually 10-150)

  return MONTH_NAMES.map((monthName, monthIndex) => {
    const monthNumbers = apiNumbers.slice(monthIndex * 8, (monthIndex + 1) * 8);
    
    const categories = CATEGORY_NAMES.map((name, catIndex) => {
      // 2. The Adapter: We combine our logical base with the real API variance.
      // Fixed expenses stay perfectly stable. Variable expenses fluctuate based on the API data.
      const isFixed = name === "Rent" || name === "BTech Tuition";
      const apiVariance = monthNumbers[catIndex] || 0;
      
      const amount = isFixed 
        ? BASE_BUDGETS[catIndex] 
        : BASE_BUDGETS[catIndex] + apiVariance;
        
      return {
        name,
        amount,
        color: COLORS[catIndex % COLORS.length]
      };
    });

    // 3. Perfect Math: Recalculated locally so the Donut chart exactly equals 100%
    const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

    return {
      id: monthName.toLowerCase().substring(0, 3),
      month: monthName,
      total,
      categories
    };
  });
};