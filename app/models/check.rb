class Check < ApplicationRecord
  # Associations
  belongs_to :frequency
  has_many :checks_schedules

  # Validations
  validates :check_type, presence: true
end
