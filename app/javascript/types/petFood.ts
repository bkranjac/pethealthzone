import { Pet } from './pet';
import { Food } from './food';
import { Frequency } from './frequency';

export interface PetFood {
  id: number;
  pet_id: number;
  food_id: number;
  frequency_id: number;
  started_at: string;
  notes?: string;
  pet?: Pet;
  food?: Food;
  frequency?: Frequency;
  created_at?: string;
  updated_at?: string;
}

export interface PetFoodFormData {
  pet_id: number;
  food_id: number;
  frequency_id: number;
  started_at: string;
  notes?: string;
}
