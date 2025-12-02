require 'rails_helper'

RSpec.describe InjuryReport, type: :model do
  describe 'associations' do
    it { should belong_to(:pet) }
    it { should belong_to(:injury) }
  end

  describe 'validations' do
    it { should validate_presence_of(:body_part) }
    it { should validate_presence_of(:date) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      injury_report = build(:injury_report)
      expect(injury_report).to be_valid
    end
  end

  describe 'creation' do
    it 'creates an injury report with all attributes' do
      pet = create(:pet)
      injury = create(:injury)

      report = create(:injury_report,
        pet: pet,
        injury: injury,
        body_part: 'Leg',
        description: 'Broken bone',
        date: Date.today
      )

      expect(report.pet).to eq(pet)
      expect(report.injury).to eq(injury)
      expect(report.body_part).to eq('Leg')
      expect(report.description).to eq('Broken bone')
      expect(report.date).to eq(Date.today)
    end
  end

  describe 'validation failures' do
    it 'fails without body_part' do
      report = build(:injury_report, body_part: nil)
      expect(report).not_to be_valid
      expect(report.errors[:body_part]).to include("can't be blank")
    end

    it 'fails without date' do
      report = build(:injury_report, date: nil)
      expect(report).not_to be_valid
      expect(report.errors[:date]).to include("can't be blank")
    end
  end
end
