class VaccinationSchedule < ApplicationRecord
  # Associations
  belongs_to :pet
  belongs_to :vaccine
  belongs_to :frequency

  # Validations
  validates :date_given, presence: true
end
