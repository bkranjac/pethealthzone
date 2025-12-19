import { Frequency } from './frequency';

export interface Check {
  id: number;
  check_type: string;
  description?: string;
  frequency_id: number;
  frequency?: Frequency;
  created_at?: string;
  updated_at?: string;
}

export interface CheckFormData {
  check_type: string;
  description?: string;
  frequency_id: number;
}
