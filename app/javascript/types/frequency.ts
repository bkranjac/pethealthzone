export interface Frequency {
  id: number;
  name: string;
  interval_days: number;
  created_at?: string;
  updated_at?: string;
}

export interface FrequencyFormData {
  name: string;
  interval_days: number;
}
