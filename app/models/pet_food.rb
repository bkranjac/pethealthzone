class PetFood < ApplicationRecord
  # Associations
  belongs_to :pet
  belongs_to :food
  belongs_to :frequency

  # Validations
  validates :started_at, presence: true
end
