export interface Food {
  id: number;
  name: string;
  food_type: string;
  amount?: string;
  description?: string;
  purpose?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FoodFormData {
  name: string;
  food_type: string;
  amount?: string;
  description?: string;
  purpose?: string;
  notes?: string;
}
