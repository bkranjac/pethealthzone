require 'rails_helper'

RSpec.describe "InjuryReports", type: :request do
  describe "GET /injury_reports" do
    it "returns a successful response" do
      get injury_reports_path
      expect(response).to be_successful
    end

    it "displays all injury reports" do
      pet = create(:pet)
      injury = create(:injury)
      injury_report1 = create(:injury_report, pet: pet, injury: injury)
      injury_report2 = create(:injury_report, pet: pet, injury: injury)

      get injury_reports_path
      expect(response.body).to include('id="root"')
    end
  end

  describe "GET /injury_reports/:id" do
    it "returns a successful response" do
      report = create(:injury_report)
      get injury_report_path(report)
      expect(response).to be_successful
    end
  end

  describe "POST /injury_reports" do
    let(:pet) { create(:pet) }
    let(:injury) { create(:injury) }

    context "with valid parameters" do
      let(:valid_attributes) do
        {
          pet_id: pet.id,
          injury_id: injury.id,
          body_part: "Leg",
          description: "Broken bone",
          date: Date.today
        }
      end

      it "creates a new injury report" do
        expect {
          post injury_reports_path, params: { injury_report: valid_attributes }
        }.to change(InjuryReport, :count).by(1)
      end

      it "redirects to the created injury report" do
        post injury_reports_path, params: { injury_report: valid_attributes }
        expect(response).to redirect_to(InjuryReport.last)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { body_part: nil, date: nil } }

      it "does not create a new injury report" do
        expect {
          post injury_reports_path, params: { injury_report: invalid_attributes }
        }.not_to change(InjuryReport, :count)
      end
    end
  end

  describe "PATCH /injury_reports/:id" do
    let(:report) { create(:injury_report, body_part: "Leg") }

    context "with valid parameters" do
      let(:new_attributes) { { body_part: "Paw" } }

      it "updates the injury report" do
        patch injury_report_path(report), params: { injury_report: new_attributes }
        report.reload
        expect(report.body_part).to eq("Paw")
      end
    end
  end

  describe "DELETE /injury_reports/:id" do
    it "destroys the injury report" do
      report = create(:injury_report)
      expect {
        delete injury_report_path(report)
      }.to change(InjuryReport, :count).by(-1)
    end
  end
end
