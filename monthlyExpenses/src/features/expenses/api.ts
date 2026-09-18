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

// Helper to fluctuate a base amount by +/- 15% to simulate real changing data
const randomizeAmount = (base: number) => {
  const variance = (Math.random() * 0.3) - 0.15; 
  return Math.round(base + (base * variance));
};

export const fetchExpenses = async (): Promise<MonthData[]> => {
  // Moving the data generation inside the fetch function means it 
  // calculates a brand new set of numbers every time the page refreshes.
  
  const generateCategories = (baseAmounts: number[]) => {
    const names = ["Rent", "BTech Tuition", "Groceries", "Utilities", "Transport", "Internet", "Dining Out", "Healthcare"];
    
    return names.map((name, i) => {
      // Rent and Tuition are usually fixed expenses, so we don't randomize them.
      // We only fluctuate the variable lifestyle expenses.
      const isFixed = name === "Rent" || name === "BTech Tuition";
      
      return {
        name,
        amount: isFixed ? baseAmounts[i] : randomizeAmount(baseAmounts[i]),
        color: COLORS[i]
      };
    });
  };

  const generatedData: MonthData[] = [
    { id: "jan", month: "January", total: 0, categories: generateCategories([1200, 800, 450, 150, 120, 80, 200, 100]) },
    { id: "feb", month: "February", total: 0, categories: generateCategories([1200, 800, 420, 145, 110, 80, 150, 90]) },
    { id: "mar", month: "March", total: 0, categories: generateCategories([1200, 800, 500, 160, 140, 80, 250, 120]) },
    { id: "apr", month: "April", total: 0, categories: generateCategories([1200, 800, 480, 150, 130, 80, 180, 80]) }
  ].map(month => ({
    ...month,
    // Dynamically calculate the perfect total based on the newly randomized numbers
    total: month.categories.reduce((sum, cat) => sum + cat.amount, 0)
  }));

  return new Promise((resolve) => {
    // 600ms delay to let the user see the loading state
    setTimeout(() => resolve(generatedData), 600); 
  });
};