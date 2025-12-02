require 'rails_helper'

RSpec.describe "Frequencies", type: :request do
  describe "GET /frequencies" do
    it "returns a successful response" do
      get frequencies_path
      expect(response).to be_successful
    end

    it "displays all frequencies" do
      frequency1 = create(:frequency, how_often: "Daily")
      frequency2 = create(:frequency, how_often: "Weekly")

      get frequencies_path
      expect(response.body).to include("Daily")
      expect(response.body).to include("Weekly")
    end
  end

  describe "GET /frequencies/:id" do
    it "returns a successful response" do
      frequency = create(:frequency)
      get frequency_path(frequency)
      expect(response).to be_successful
    end
  end

  describe "POST /frequencies" do
    context "with valid parameters" do
      let(:valid_attributes) { { how_often: "Monthly" } }

      it "creates a new frequency" do
        expect {
          post frequencies_path, params: { frequency: valid_attributes }
        }.to change(Frequency, :count).by(1)
      end

      it "redirects to the created frequency" do
        post frequencies_path, params: { frequency: valid_attributes }
        expect(response).to redirect_to(Frequency.last)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { how_often: nil } }

      it "does not create a new frequency" do
        expect {
          post frequencies_path, params: { frequency: invalid_attributes }
        }.not_to change(Frequency, :count)
      end
    end
  end

  describe "PATCH /frequencies/:id" do
    let(:frequency) { create(:frequency, how_often: "Daily") }

    context "with valid parameters" do
      let(:new_attributes) { { how_often: "Weekly" } }

      it "updates the frequency" do
        patch frequency_path(frequency), params: { frequency: new_attributes }
        frequency.reload
        expect(frequency.how_often).to eq("Weekly")
      end
    end
  end

  describe "DELETE /frequencies/:id" do
    it "destroys the frequency" do
      frequency = create(:frequency)
      expect {
        delete frequency_path(frequency)
      }.to change(Frequency, :count).by(-1)
    end
  end
end
