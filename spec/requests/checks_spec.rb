require 'rails_helper'

RSpec.describe "Checks", type: :request do
  describe "GET /checks" do
    it "returns a successful response" do
      get checks_path
      expect(response).to be_successful
    end

    it "displays all checks" do
      check1 = create(:check, check_type: "Physical")
      check2 = create(:check, check_type: "Dental")
      get checks_path
      expect(response.body).to include('id="root"')
    end
  end

  describe "GET /checks/:id" do
    it "returns a successful response" do
      check = create(:check)
      get check_path(check)
      expect(response).to be_successful
    end
  end

  describe "POST /checks" do
    let(:frequency) { create(:frequency) }

    context "with valid parameters" do
      let(:valid_attributes) do
        {
          check_type: "Physical",
          frequency_id: frequency.id
        }
      end

      it "creates a new check" do
        expect {
          post checks_path, params: { check: valid_attributes }
        }.to change(Check, :count).by(1)
      end

      it "redirects to the created check" do
        post checks_path, params: { check: valid_attributes }
        expect(response).to redirect_to(Check.last)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { check_type: nil } }

      it "does not create a new check" do
        expect {
          post checks_path, params: { check: invalid_attributes }
        }.not_to change(Check, :count)
      end
    end
  end

  describe "PATCH /checks/:id" do
    let(:check) { create(:check, check_type: "Physical") }

    context "with valid parameters" do
      let(:new_attributes) { { check_type: "Dental" } }

      it "updates the check" do
        patch check_path(check), params: { check: new_attributes }
        check.reload
        expect(check.check_type).to eq("Dental")
      end
    end
  end

  describe "DELETE /checks/:id" do
    it "destroys the check" do
      check = create(:check)
      expect {
        delete check_path(check)
      }.to change(Check, :count).by(-1)
    end
  end
end
