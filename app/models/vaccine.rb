class Vaccine < ApplicationRecord
  # Associations
  belongs_to :frequency
  has_many :vaccination_schedules

  # Validations
  validates :name, presence: true
end
