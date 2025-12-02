require 'rails_helper'

RSpec.describe ChecksSchedule, type: :model do
  describe 'associations' do
    it { should belong_to(:pet) }
    it { should belong_to(:check) }
  end

  describe 'validations' do
    it { should validate_presence_of(:date_created) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      checks_schedule = build(:checks_schedule)
      expect(checks_schedule).to be_valid
    end
  end

  describe 'creation' do
    it 'creates a checks schedule with all attributes' do
      pet = create(:pet)
      check = create(:check)

      schedule = create(:checks_schedule,
        pet: pet,
        check: check,
        date_created: Date.today,
        notes: 'Check completed',
        performed: true
      )

      expect(schedule.pet).to eq(pet)
      expect(schedule.check).to eq(check)
      expect(schedule.date_created).to eq(Date.today)
      expect(schedule.notes).to eq('Check completed')
      expect(schedule.performed).to eq(true)
    end
  end

  describe 'validation failures' do
    it 'fails without date_created' do
      schedule = build(:checks_schedule, date_created: nil)
      expect(schedule).not_to be_valid
      expect(schedule.errors[:date_created]).to include("can't be blank")
    end
  end

  describe 'performed status' do
    it 'can be marked as performed' do
      schedule = create(:checks_schedule, performed: true)
      expect(schedule.performed).to eq(true)
    end

    it 'can be marked as not performed' do
      schedule = create(:checks_schedule, performed: false)
      expect(schedule.performed).to eq(false)
    end
  end
end
