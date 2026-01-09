export interface Recipe {
  result: string;
  ingredients: {
    id: string;
    quantity: number;
  }[];
}
