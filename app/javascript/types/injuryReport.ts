import { Pet } from './pet';
import { Injury } from './injury';

export interface InjuryReport {
  id: number;
  pet_id: number;
  injury_id: number;
  body_part: string;
  description: string;
  date: string;
  pet?: Pet;
  injury?: Injury;
  created_at?: string;
  updated_at?: string;
}

export interface InjuryReportFormData {
  pet_id: number;
  injury_id: number;
  body_part: string;
  description: string;
  date: string;
}
