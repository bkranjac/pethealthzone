class Medication < ApplicationRecord
  # Associations
  has_many :medication_schedules, dependent: :destroy

  # Validations
  validates :name, presence: true
  validates :amount, presence: true
end
