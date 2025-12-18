require 'rails_helper'

RSpec.describe "Injuries", type: :request do
  describe "GET /injuries" do
    it "returns a successful response" do
      get injuries_path
      expect(response).to be_successful
    end

    it "displays React container for injuries" do
      injury1 = create(:injury, description: "Broken leg", severity: "Severe")
      injury2 = create(:injury, description: "Minor cut", severity: "Mild")

      get injuries_path
      expect(response.body).to include('id="root"')
    end
  end

  describe "GET /injuries/:id" do
    it "returns a successful response" do
      injury = create(:injury)
      get injury_path(injury)
      expect(response).to be_successful
    end
  end

  describe "POST /injuries" do
    context "with valid parameters" do
      let(:valid_attributes) do
        {
          description: "Broken leg",
          severity: "Severe"
        }
      end

      it "creates a new injury" do
        expect {
          post injuries_path, params: { injury: valid_attributes }
        }.to change(Injury, :count).by(1)
      end

      it "redirects to the created injury" do
        post injuries_path, params: { injury: valid_attributes }
        expect(response).to redirect_to(Injury.last)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { description: nil, severity: nil } }

      it "does not create a new injury" do
        expect {
          post injuries_path, params: { injury: invalid_attributes }
        }.not_to change(Injury, :count)
      end
    end
  end

  describe "PATCH /injuries/:id" do
    let(:injury) { create(:injury, description: "Broken leg") }

    context "with valid parameters" do
      let(:new_attributes) { { description: "Fractured leg" } }

      it "updates the injury" do
        patch injury_path(injury), params: { injury: new_attributes }
        injury.reload
        expect(injury.description).to eq("Fractured leg")
      end
    end
  end

  describe "DELETE /injuries/:id" do
    it "destroys the injury" do
      injury = create(:injury)
      expect {
        delete injury_path(injury)
      }.to change(Injury, :count).by(-1)
    end
  end
end
