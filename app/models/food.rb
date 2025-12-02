class Food < ApplicationRecord
  # Associations
  has_many :pet_foods

  # Validations
  validates :name, presence: true
  validates :food_type, presence: true
  validates :amount, presence: true
end
