class Location < ApplicationRecord
  # Associations
  has_many :pets, dependent: :nullify

  # Validations
  validates :name, presence: true
end
