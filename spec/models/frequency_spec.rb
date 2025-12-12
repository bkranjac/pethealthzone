require 'rails_helper'

RSpec.describe Frequency, type: :model do
  describe 'associations' do
    it { should have_many(:checks) }
    it { should have_many(:vaccines) }
    it { should have_many(:medication_schedules) }
    it { should have_many(:vaccination_schedules) }
    it { should have_many(:pet_foods) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      frequency = build(:frequency)
      expect(frequency).to be_valid
    end
  end

  describe 'creation' do
    it 'creates a frequency with name and interval_days attributes' do
      frequency = create(:frequency, name: 'Weekly', interval_days: 7)
      expect(frequency.name).to eq('Weekly')
      expect(frequency.interval_days).to eq(7)
    end
  end
end
