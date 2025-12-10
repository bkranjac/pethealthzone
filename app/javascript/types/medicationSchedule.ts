import { Pet } from './pet';
import { Medication } from './medication';
import { Frequency } from './frequency';

export interface MedicationSchedule {
  id: number;
  pet_id: number;
  medication_id: number;
  frequency_id: number;
  date_started: string;
  date_ended?: string;
  notes?: string;
  pet?: Pet;
  medication?: Medication;
  frequency?: Frequency;
  created_at?: string;
  updated_at?: string;
}

export interface MedicationScheduleFormData {
  pet_id: number;
  medication_id: number;
  frequency_id: number;
  date_started: string;
  date_ended?: string;
  notes?: string;
}
