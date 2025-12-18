import { Pet } from './pet';
import { Vaccine } from './vaccine';
import { Frequency } from './frequency';

export interface VaccinationSchedule {
  id: number;
  pet_id: number;
  vaccine_id: number;
  frequency_id: number;
  date_given: string;
  notes?: string;
  pet?: Pet;
  vaccine?: Vaccine;
  frequency?: Frequency;
  created_at?: string;
  updated_at?: string;
}

export interface VaccinationScheduleFormData {
  pet_id: number;
  vaccine_id: number;
  frequency_id: number;
  date_given: string;
  notes?: string;
}
