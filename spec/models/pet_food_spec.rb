require 'rails_helper'

RSpec.describe PetFood, type: :model do
  describe 'associations' do
    it { should belong_to(:pet) }
    it { should belong_to(:food) }
    it { should belong_to(:frequency) }
  end

  describe 'validations' do
    it { should validate_presence_of(:started_at) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      pet_food = build(:pet_food)
      expect(pet_food).to be_valid
    end
  end

  describe 'creation' do
    it 'creates a pet food with all attributes' do
      pet = create(:pet)
      food = create(:food)
      frequency = create(:frequency)

      pet_food = create(:pet_food,
        pet: pet,
        food: food,
        frequency: frequency,
        started_at: Date.today,
        notes: 'Enjoys this food'
      )

      expect(pet_food.pet).to eq(pet)
      expect(pet_food.food).to eq(food)
      expect(pet_food.frequency).to eq(frequency)
      expect(pet_food.started_at).to eq(Date.today)
      expect(pet_food.notes).to eq('Enjoys this food')
    end
  end

  describe 'validation failures' do
    it 'fails without started_at' do
      pet_food = build(:pet_food, started_at: nil)
      expect(pet_food).not_to be_valid
      expect(pet_food.errors[:started_at]).to include("can't be blank")
    end
  end
end
