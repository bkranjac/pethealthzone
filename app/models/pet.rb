class Pet < ApplicationRecord
  # Associations
  has_many :injury_reports
  has_many :medication_schedules
  has_many :vaccination_schedules
  has_many :pet_foods
  has_many :checks_schedules

  # Validations
  validates :name, presence: true
  validates :pet_type, presence: true
  validates :birthday, presence: true
  validates :date_admitted, presence: true
end
