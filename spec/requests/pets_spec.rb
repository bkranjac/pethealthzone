require 'rails_helper'

RSpec.describe "Pets", type: :request do
  describe "GET /pets" do
    it "returns a successful response" do
      get pets_path
      expect(response).to be_successful
    end

    it "displays all pets" do
      pet1 = create(:pet, name: "Buddy")
      pet2 = create(:pet, name: "Max")

      get pets_path
      expect(response.body).to include('id="root"')
    end
  end

  describe "GET /pets/:id" do
    it "returns a successful response" do
      pet = create(:pet)
      get pet_path(pet)
      expect(response).to be_successful
    end

    it "displays the pet details" do
      pet = create(:pet, name: "Buddy", pet_type: "Dog")
      get pet_path(pet)

      expect(response.body).to include('id="root"')
    end
  end

  describe "GET /pets/new" do
    it "returns a successful response" do
      get new_pet_path
      expect(response).to be_successful
    end
  end

  describe "POST /pets" do
    context "with valid parameters" do
      let(:valid_attributes) do
        {
          pet_type: "Dog",
          gender: "Male",
          breed: "Golden Retriever",
          name: "Buddy",
          nickname: "Bud",
          birthday: Date.today - 2.years,
          date_admitted: Date.today
        }
      end

      it "creates a new pet" do
        expect {
          post pets_path, params: { pet: valid_attributes }
        }.to change(Pet, :count).by(1)
      end

      it "redirects to the created pet" do
        post pets_path, params: { pet: valid_attributes }
        expect(response).to redirect_to(Pet.last)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { pet_type: nil, name: nil } }

      it "does not create a new pet" do
        expect {
          post pets_path, params: { pet: invalid_attributes }
        }.not_to change(Pet, :count)
      end
    end
  end

  describe "GET /pets/:id/edit" do
    it "returns a successful response" do
      pet = create(:pet)
      get edit_pet_path(pet)
      expect(response).to be_successful
    end
  end

  describe "PATCH /pets/:id" do
    let(:pet) { create(:pet, name: "Buddy") }

    context "with valid parameters" do
      let(:new_attributes) { { name: "Max" } }

      it "updates the pet" do
        patch pet_path(pet), params: { pet: new_attributes }
        pet.reload
        expect(pet.name).to eq("Max")
      end

      it "redirects to the pet" do
        patch pet_path(pet), params: { pet: new_attributes }
        expect(response).to redirect_to(pet)
      end
    end
  end

  describe "DELETE /pets/:id" do
    it "destroys the pet" do
      pet = create(:pet)
      expect {
        delete pet_path(pet)
      }.to change(Pet, :count).by(-1)
    end

    it "redirects to the pets list" do
      pet = create(:pet)
      delete pet_path(pet)
      expect(response).to redirect_to(pets_path)
    end
  end
end
