require 'rails_helper'

RSpec.describe "Foods", type: :request do
  describe "GET /foods" do
    it "returns a successful response" do
      get foods_path
      expect(response).to be_successful
    end

    it "displays all foods" do
      food1 = create(:food, name: "Premium Dog Food")
      food2 = create(:food, name: "Cat Food")

      get foods_path
      expect(response.body).to include('id="root"')
    end
  end

  describe "GET /foods/:id" do
    it "returns a successful response" do
      food = create(:food)
      get food_path(food)
      expect(response).to be_successful
    end

    it "displays the food details" do
      food = create(:food, name: "Premium Dog Food", food_type: "Dry")
      get food_path(food)

      expect(response.body).to include('id="root"')
    end
  end

  describe "POST /foods" do
    context "with valid parameters" do
      let(:valid_attributes) do
        {
          name: "Premium Dog Food",
          food_type: "Dry",
          amount: "200 grams",
          purpose: "Maintenance"
        }
      end

      it "creates a new food" do
        expect {
          post foods_path, params: { food: valid_attributes }
        }.to change(Food, :count).by(1)
      end

      it "redirects to the created food" do
        post foods_path, params: { food: valid_attributes }
        expect(response).to redirect_to(Food.last)
      end
    end
  end

  describe "PATCH /foods/:id" do
    let(:food) { create(:food, name: "Dog Food") }

    context "with valid parameters" do
      let(:new_attributes) { { name: "Premium Dog Food" } }

      it "updates the food" do
        patch food_path(food), params: { food: new_attributes }
        food.reload
        expect(food.name).to eq("Premium Dog Food")
      end
    end
  end

  describe "DELETE /foods/:id" do
    it "destroys the food" do
      food = create(:food)
      expect {
        delete food_path(food)
      }.to change(Food, :count).by(-1)
    end
  end
end
