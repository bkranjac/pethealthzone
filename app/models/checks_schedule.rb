class ChecksSchedule < ApplicationRecord
  # Associations
  belongs_to :pet
  belongs_to :check

  # Validations
  validates :date_created, presence: true
end
