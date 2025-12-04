class Pet < ApplicationRecord
  # Associations
  has_many :injury_reports, dependent: :destroy
  has_many :medication_schedules, dependent: :destroy
  has_many :vaccination_schedules, dependent: :destroy
  has_many :pet_foods, dependent: :destroy
  has_many :checks_schedules, dependent: :destroy

  # Validations
  validates :name, presence: true
  validates :pet_type, presence: true
  validates :birthday, presence: true
  validates :date_admitted, presence: true
end
