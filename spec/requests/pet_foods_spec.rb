require 'rails_helper'

RSpec.describe "PetFoods", type: :request do
  describe "GET /pet_foods" do
    it "returns a successful response" do
      get pet_foods_path
      expect(response).to be_successful
    end

    it "displays all pet foods" do
      pet_food1 = create(:pet_food)
      pet_food2 = create(:pet_food)

      get pet_foods_path
      expect(response).to be_successful
    end
  end

  describe "GET /pet_foods/:id" do
    it "returns a successful response" do
      pet_food = create(:pet_food)
      get pet_food_path(pet_food)
      expect(response).to be_successful
    end
  end

  describe "POST /pet_foods" do
    let(:pet) { create(:pet) }
    let(:food) { create(:food) }
    let(:frequency) { create(:frequency) }

    context "with valid parameters" do
      let(:valid_attributes) do
        {
          pet_id: pet.id,
          food_id: food.id,
          frequency_id: frequency.id,
          started_at: Date.today,
          notes: "Enjoys this food"
        }
      end

      it "creates a new pet food" do
        expect {
          post pet_foods_path, params: { pet_food: valid_attributes }
        }.to change(PetFood, :count).by(1)
      end

      it "redirects to the created pet food" do
        post pet_foods_path, params: { pet_food: valid_attributes }
        expect(response).to redirect_to(PetFood.last)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { started_at: nil } }

      it "does not create a new pet food" do
        expect {
          post pet_foods_path, params: { pet_food: invalid_attributes }
        }.not_to change(PetFood, :count)
      end
    end
  end

  describe "PATCH /pet_foods/:id" do
    let(:pet_food) { create(:pet_food, notes: "Original notes") }

    context "with valid parameters" do
      let(:new_attributes) { { notes: "Updated notes" } }

      it "updates the pet food" do
        patch pet_food_path(pet_food), params: { pet_food: new_attributes }
        pet_food.reload
        expect(pet_food.notes).to eq("Updated notes")
      end
    end
  end

  describe "DELETE /pet_foods/:id" do
    it "destroys the pet food" do
      pet_food = create(:pet_food)
      expect {
        delete pet_food_path(pet_food)
      }.to change(PetFood, :count).by(-1)
    end
  end
end
