require 'rails_helper'

RSpec.describe Check, type: :model do
  describe 'associations' do
    it { should belong_to(:frequency) }
    it { should have_many(:checks_schedules) }
  end

  describe 'validations' do
    it { should validate_presence_of(:check_type) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      check = build(:check)
      expect(check).to be_valid
    end
  end

  describe 'creation' do
    it 'creates a check with all attributes' do
      frequency = create(:frequency)
      check = create(:check,
        check_type: 'Physical',
        frequency: frequency
      )

      expect(check.check_type).to eq('Physical')
      expect(check.frequency).to eq(frequency)
    end
  end

  describe 'validation failures' do
    it 'fails without check_type' do
      check = build(:check, check_type: nil)
      expect(check).not_to be_valid
      expect(check.errors[:check_type]).to include("can't be blank")
    end
  end
end
