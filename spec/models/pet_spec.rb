require 'rails_helper'

RSpec.describe Pet, type: :model do
  describe 'associations' do
    it { should have_many(:injury_reports) }
    it { should have_many(:medication_schedules) }
    it { should have_many(:vaccination_schedules) }
    it { should have_many(:pet_foods) }
    it { should have_many(:checks_schedules) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      pet = build(:pet)
      expect(pet).to be_valid
    end
  end

  describe 'creation' do
    it 'creates a pet with all attributes' do
      pet = create(:pet,
        name: 'Buddy',
        pet_type: 'Dog',
        gender: 'Male',
        breed: 'Golden Retriever'
      )

      expect(pet.name).to eq('Buddy')
      expect(pet.pet_type).to eq('Dog')
      expect(pet.gender).to eq('Male')
      expect(pet.breed).to eq('Golden Retriever')
    end
  end
end
