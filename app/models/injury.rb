class Injury < ApplicationRecord
  # Associations
  has_many :injury_reports, dependent: :destroy

  # Validations
  validates :description, presence: true
  validates :severity, presence: true
end
