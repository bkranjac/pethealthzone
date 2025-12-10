import { Frequency } from './frequency';

export interface Vaccine {
  id: number;
  name: string;
  description?: string;
  frequency_id: number;
  frequency?: Frequency;
  created_at?: string;
  updated_at?: string;
}

export interface VaccineFormData {
  name: string;
  description?: string;
  frequency_id: number;
}
