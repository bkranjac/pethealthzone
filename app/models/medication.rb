class Medication < ApplicationRecord
  # Associations
  has_many :medication_schedules

  # Validations
  validates :name, presence: true
  validates :amount, presence: true
end
