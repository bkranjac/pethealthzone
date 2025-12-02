require 'rails_helper'

RSpec.describe "Medications", type: :request do
  describe "GET /medications" do
    it "returns a successful response" do
      get medications_path
      expect(response).to be_successful
    end

    it "displays all medications" do
      medication1 = create(:medication, name: "Aspirin")
      medication2 = create(:medication, name: "Antibiotic")

      get medications_path
      expect(response.body).to include("Aspirin")
      expect(response.body).to include("Antibiotic")
    end
  end

  describe "GET /medications/:id" do
    it "returns a successful response" do
      medication = create(:medication)
      get medication_path(medication)
      expect(response).to be_successful
    end
  end

  describe "POST /medications" do
    context "with valid parameters" do
      let(:valid_attributes) do
        {
          name: "Aspirin",
          amount: "50mg",
          purpose: "Pain relief",
          expiration_date: Date.today + 1.year
        }
      end

      it "creates a new medication" do
        expect {
          post medications_path, params: { medication: valid_attributes }
        }.to change(Medication, :count).by(1)
      end

      it "redirects to the created medication" do
        post medications_path, params: { medication: valid_attributes }
        expect(response).to redirect_to(Medication.last)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { name: nil, amount: nil } }

      it "does not create a new medication" do
        expect {
          post medications_path, params: { medication: invalid_attributes }
        }.not_to change(Medication, :count)
      end
    end
  end

  describe "PATCH /medications/:id" do
    let(:medication) { create(:medication, name: "Aspirin") }

    context "with valid parameters" do
      let(:new_attributes) { { name: "Ibuprofen" } }

      it "updates the medication" do
        patch medication_path(medication), params: { medication: new_attributes }
        medication.reload
        expect(medication.name).to eq("Ibuprofen")
      end
    end
  end

  describe "DELETE /medications/:id" do
    it "destroys the medication" do
      medication = create(:medication)
      expect {
        delete medication_path(medication)
      }.to change(Medication, :count).by(-1)
    end
  end
end
