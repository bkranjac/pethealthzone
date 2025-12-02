require 'rails_helper'

RSpec.describe MedicationSchedule, type: :model do
  describe 'associations' do
    it { should belong_to(:pet) }
    it { should belong_to(:medication) }
    it { should belong_to(:frequency) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      medication_schedule = build(:medication_schedule)
      expect(medication_schedule).to be_valid
    end
  end

  describe 'creation' do
    it 'creates a medication schedule with all attributes' do
      pet = create(:pet)
      medication = create(:medication)
      frequency = create(:frequency)

      schedule = create(:medication_schedule,
        pet: pet,
        medication: medication,
        frequency: frequency,
        notes: 'Give with food'
      )

      expect(schedule.pet).to eq(pet)
      expect(schedule.medication).to eq(medication)
      expect(schedule.frequency).to eq(frequency)
      expect(schedule.notes).to eq('Give with food')
    end
  end
end
