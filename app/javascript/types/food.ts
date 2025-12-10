export interface Food {
  id: number;
  name: string;
  brand: string;
  ingredients?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FoodFormData {
  name: string;
  brand: string;
  ingredients?: string;
}
