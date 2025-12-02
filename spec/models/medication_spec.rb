require 'rails_helper'

RSpec.describe Medication, type: :model do
  describe 'associations' do
    it { should have_many(:medication_schedules) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:amount) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      medication = build(:medication)
      expect(medication).to be_valid
    end
  end

  describe 'creation' do
    it 'creates a medication with all attributes' do
      medication = create(:medication,
        name: 'Aspirin',
        amount: '50mg',
        purpose: 'Pain relief',
        expiration_date: Date.today + 1.year
      )

      expect(medication.name).to eq('Aspirin')
      expect(medication.amount).to eq('50mg')
      expect(medication.purpose).to eq('Pain relief')
      expect(medication.expiration_date).to eq(Date.today + 1.year)
    end
  end

  describe 'validation failures' do
    it 'fails without name' do
      medication = build(:medication, name: nil)
      expect(medication).not_to be_valid
      expect(medication.errors[:name]).to include("can't be blank")
    end

    it 'fails without amount' do
      medication = build(:medication, amount: nil)
      expect(medication).not_to be_valid
      expect(medication.errors[:amount]).to include("can't be blank")
    end
  end
end
