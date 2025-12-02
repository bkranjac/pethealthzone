require 'rails_helper'

RSpec.describe Vaccine, type: :model do
  describe 'associations' do
    it { should belong_to(:frequency) }
    it { should have_many(:vaccination_schedules) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      vaccine = build(:vaccine)
      expect(vaccine).to be_valid
    end
  end

  describe 'creation' do
    it 'creates a vaccine with all attributes' do
      frequency = create(:frequency)
      vaccine = create(:vaccine,
        name: 'Rabies',
        frequency: frequency,
        mandatory: true
      )

      expect(vaccine.name).to eq('Rabies')
      expect(vaccine.frequency).to eq(frequency)
      expect(vaccine.mandatory).to eq(true)
    end
  end

  describe 'validation failures' do
    it 'fails without name' do
      vaccine = build(:vaccine, name: nil)
      expect(vaccine).not_to be_valid
      expect(vaccine.errors[:name]).to include("can't be blank")
    end
  end
end
