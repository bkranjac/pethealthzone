require 'rails_helper'

RSpec.describe "Vaccines", type: :request do
  describe "GET /vaccines" do
    it "returns a successful response" do
      get vaccines_path
      expect(response).to be_successful
    end

    it "displays all vaccines" do
      vaccine1 = create(:vaccine, name: "Rabies")
      vaccine2 = create(:vaccine, name: "Distemper")

      get vaccines_path
      expect(response.body).to include("Rabies")
      expect(response.body).to include("Distemper")
    end
  end

  describe "GET /vaccines/:id" do
    it "returns a successful response" do
      vaccine = create(:vaccine)
      get vaccine_path(vaccine)
      expect(response).to be_successful
    end
  end

  describe "POST /vaccines" do
    let(:frequency) { create(:frequency) }

    context "with valid parameters" do
      let(:valid_attributes) do
        {
          name: "Rabies",
          frequency_id: frequency.id,
          mandatory: true
        }
      end

      it "creates a new vaccine" do
        expect {
          post vaccines_path, params: { vaccine: valid_attributes }
        }.to change(Vaccine, :count).by(1)
      end

      it "redirects to the created vaccine" do
        post vaccines_path, params: { vaccine: valid_attributes }
        expect(response).to redirect_to(Vaccine.last)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { name: nil } }

      it "does not create a new vaccine" do
        expect {
          post vaccines_path, params: { vaccine: invalid_attributes }
        }.not_to change(Vaccine, :count)
      end
    end
  end

  describe "PATCH /vaccines/:id" do
    let(:vaccine) { create(:vaccine, name: "Rabies") }

    context "with valid parameters" do
      let(:new_attributes) { { name: "Distemper" } }

      it "updates the vaccine" do
        patch vaccine_path(vaccine), params: { vaccine: new_attributes }
        vaccine.reload
        expect(vaccine.name).to eq("Distemper")
      end
    end
  end

  describe "DELETE /vaccines/:id" do
    it "destroys the vaccine" do
      vaccine = create(:vaccine)
      expect {
        delete vaccine_path(vaccine)
      }.to change(Vaccine, :count).by(-1)
    end
  end
end
