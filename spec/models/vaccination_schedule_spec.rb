require 'rails_helper'

RSpec.describe VaccinationSchedule, type: :model do
  describe 'associations' do
    it { should belong_to(:pet) }
    it { should belong_to(:vaccine) }
    it { should belong_to(:frequency) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      vaccination_schedule = build(:vaccination_schedule)
      expect(vaccination_schedule).to be_valid
    end
  end

  describe 'creation' do
    it 'creates a vaccination schedule with all attributes' do
      pet = create(:pet)
      vaccine = create(:vaccine)
      frequency = create(:frequency)

      schedule = create(:vaccination_schedule,
        pet: pet,
        vaccine: vaccine,
        frequency: frequency,
        date_given: Date.today
      )

      expect(schedule.pet).to eq(pet)
      expect(schedule.vaccine).to eq(vaccine)
      expect(schedule.frequency).to eq(frequency)
      expect(schedule.date_given).to eq(Date.today)
    end
  end
end
