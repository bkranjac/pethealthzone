import { Frequency } from './frequency';

export interface Vaccine {
  id: number;
  name: string;
  mandatory: boolean;
  frequency_id: number;
  frequency?: Frequency;
  created_at?: string;
  updated_at?: string;
}

export interface VaccineFormData {
  name: string;
  mandatory: boolean;
  frequency_id: number;
}
