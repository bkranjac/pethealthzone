class PetAdoption < ApplicationRecord
  # Associations
  belongs_to :pet

  # Validations
  validates :pet_id, presence: true
  validates :adoption_date, presence: true
end
