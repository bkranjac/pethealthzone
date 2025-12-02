class InjuryReport < ApplicationRecord
  # Associations
  belongs_to :pet
  belongs_to :injury

  # Validations
  validates :body_part, presence: true
  validates :date, presence: true
end
