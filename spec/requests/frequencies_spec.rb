require 'rails_helper'

RSpec.describe "Frequencies", type: :request do
  describe "GET /frequencies" do
    it "returns a successful response" do
      get frequencies_path
      expect(response).to be_successful
    end

    it "displays all frequencies" do
      frequency1 = create(:frequency, name: "Daily", interval_days: 1)
      frequency2 = create(:frequency, name: "Weekly", interval_days: 7)

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
      let(:valid_attributes) { { name: "Monthly", interval_days: 30 } }

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
      let(:invalid_attributes) { { name: nil, interval_days: nil } }

      it "does not create a new frequency" do
        expect {
          post frequencies_path, params: { frequency: invalid_attributes }
        }.not_to change(Frequency, :count)
      end
    end
  end

  describe "PATCH /frequencies/:id" do
    let(:frequency) { create(:frequency, name: "Daily", interval_days: 1) }

    context "with valid parameters" do
      let(:new_attributes) { { name: "Weekly", interval_days: 7 } }

      it "updates the frequency" do
        patch frequency_path(frequency), params: { frequency: new_attributes }
        frequency.reload
        expect(frequency.name).to eq("Weekly")
        expect(frequency.interval_days).to eq(7)
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
