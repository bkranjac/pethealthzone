require 'rails_helper'

RSpec.describe Injury, type: :model do
  describe 'associations' do
    it { should have_many(:injury_reports) }
  end

  describe 'validations' do
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:severity) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      injury = build(:injury)
      expect(injury).to be_valid
    end
  end

  describe 'creation' do
    it 'creates an injury with all attributes' do
      injury = create(:injury,
        description: 'Broken leg',
        severity: 'Severe'
      )

      expect(injury.description).to eq('Broken leg')
      expect(injury.severity).to eq('Severe')
    end
  end

  describe 'validation failures' do
    it 'fails without description' do
      injury = build(:injury, description: nil)
      expect(injury).not_to be_valid
      expect(injury.errors[:description]).to include("can't be blank")
    end

    it 'fails without severity' do
      injury = build(:injury, severity: nil)
      expect(injury).not_to be_valid
      expect(injury.errors[:severity]).to include("can't be blank")
    end
  end
end
