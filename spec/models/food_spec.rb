require 'rails_helper'

RSpec.describe Food, type: :model do
  describe 'associations' do
    it { should have_many(:pet_foods) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      food = build(:food)
      expect(food).to be_valid
    end
  end

  describe 'creation' do
    it 'creates a food with all attributes' do
      food = create(:food,
        name: 'Premium Dog Food',
        food_type: 'Dry',
        amount: '200 grams',
        purpose: 'Maintenance'
      )

      expect(food.name).to eq('Premium Dog Food')
      expect(food.food_type).to eq('Dry')
      expect(food.amount).to eq('200 grams')
      expect(food.purpose).to eq('Maintenance')
    end
  end
end
