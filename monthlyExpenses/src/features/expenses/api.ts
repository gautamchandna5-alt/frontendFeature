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

// A helper array to assign nice colors to the random DummyJSON products
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];
const MONTH_NAMES = ["January", "February", "March", "April"];

export const fetchExpenses = async (): Promise<MonthData[]> => {
  // Fetch 4 shopping carts from the real DummyJSON API
  const response = await fetch('https://dummyjson.com/carts?limit=4');
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  const data = await response.json();
  console.log(data)

  // Transform the DummyJSON cart data into our Expense format
  return data.carts.map((cart: any, index: number) => {
    return {
      id: cart.id.toString(),
      month: MONTH_NAMES[index], // Fake the month name for the UI
      total: cart.total,
      // Take up to 5 products from the cart to act as our pie chart slices
      categories: cart.products.slice(0, 5).map((product: any, i: number) => ({
        name: product.title.substring(0, 15) + (product.title.length > 15 ? '...' : ''), // Truncate long names
        amount: product.total,
        color: COLORS[i % COLORS.length] 
      }))
    };
  });
};