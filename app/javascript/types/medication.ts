export interface Medication {
  id: number;
  name: string;
  amount: string;
  purpose: string;
  expiration_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface MedicationFormData {
  name: string;
  amount: string;
  purpose: string;
  expiration_date: string;
}
