class Vaccine < ApplicationRecord
  # Associations
  belongs_to :frequency
  has_many :vaccination_schedules, dependent: :destroy

  # Validations
  validates :name, presence: true
end
