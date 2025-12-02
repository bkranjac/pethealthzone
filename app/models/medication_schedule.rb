class MedicationSchedule < ApplicationRecord
  # Associations
  belongs_to :pet
  belongs_to :medication
  belongs_to :frequency

  # Validations
  validates :date_started, presence: true
end
