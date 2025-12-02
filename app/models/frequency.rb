class Frequency < ApplicationRecord
  # Associations
  has_many :checks
  has_many :vaccines
  has_many :medication_schedules
  has_many :vaccination_schedules
  has_many :pet_foods

  # Validations
  validates :how_often, presence: true
end
