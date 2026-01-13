class Injury < ApplicationRecord
  # Enums
  enum severity: { minor: 0, moderate: 1, severe: 2, critical: 3 }

  # Associations
  has_many :injury_reports, dependent: :destroy

  # Validations
  validates :description, presence: true
  validates :severity, presence: true
end
