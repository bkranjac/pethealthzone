export interface Pet {
  id: number;
  pet_type: string;
  breed: string;
  picture?: string;
  birthday: string;
  name: string;
  nickname?: string;
  gender?: string;
  date_admitted: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PetFormData {
  pet_type: string;
  breed: string;
  picture?: string;
  birthday: string;
  name: string;
  nickname?: string;
  gender?: string;
  date_admitted: string;
  notes?: string;
}
