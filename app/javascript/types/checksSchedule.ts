import { Pet } from './pet';
import { Check } from './check';

export interface ChecksSchedule {
  id: number;
  pet_id: number;
  check_id: number;
  date_created: string;
  notes?: string;
  performed: boolean;
  pet?: Pet;
  check?: Check;
  created_at?: string;
  updated_at?: string;
}

export interface ChecksScheduleFormData {
  pet_id: number;
  check_id: number;
  date_created: string;
  notes?: string;
  performed: boolean;
}
