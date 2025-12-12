class Frequency < ApplicationRecord
  # Associations
  has_many :checks, dependent: :destroy
  has_many :vaccines, dependent: :destroy
  has_many :medication_schedules, dependent: :destroy
  has_many :vaccination_schedules, dependent: :destroy
  has_many :pet_foods, dependent: :destroy

  # Validations
  validates :name, presence: true
  validates :interval_days, presence: true, numericality: { only_integer: true, greater_than: 0 }
end
