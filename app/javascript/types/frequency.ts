export interface Frequency {
  id: number;
  interval_days: number;
  created_at?: string;
  updated_at?: string;
}

export interface FrequencyFormData {
  interval_days: number;
}
