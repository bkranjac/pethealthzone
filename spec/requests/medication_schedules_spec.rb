require 'rails_helper'

RSpec.describe "MedicationSchedules", type: :request do
  describe "GET /medication_schedules" do
    it "returns a successful response" do
      get medication_schedules_path
      expect(response).to be_successful
    end

    it "displays all medication schedules" do
      schedule1 = create(:medication_schedule)
      schedule2 = create(:medication_schedule)

      get medication_schedules_path
      expect(response).to be_successful
    end
  end

  describe "GET /medication_schedules/:id" do
    it "returns a successful response" do
      schedule = create(:medication_schedule)
      get medication_schedule_path(schedule)
      expect(response).to be_successful
    end
  end

  describe "POST /medication_schedules" do
    let(:pet) { create(:pet) }
    let(:medication) { create(:medication) }
    let(:frequency) { create(:frequency) }

    context "with valid parameters" do
      let(:valid_attributes) do
        {
          pet_id: pet.id,
          medication_id: medication.id,
          frequency_id: frequency.id,
          date_started: Date.today,
          date_ended: Date.today + 30.days,
          notes: "Give with food"
        }
      end

      it "creates a new medication schedule" do
        expect {
          post medication_schedules_path, params: { medication_schedule: valid_attributes }
        }.to change(MedicationSchedule, :count).by(1)
      end

      it "redirects to the created medication schedule" do
        post medication_schedules_path, params: { medication_schedule: valid_attributes }
        expect(response).to redirect_to(MedicationSchedule.last)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { date_started: nil } }

      it "does not create a new medication schedule" do
        expect {
          post medication_schedules_path, params: { medication_schedule: invalid_attributes }
        }.not_to change(MedicationSchedule, :count)
      end
    end
  end

  describe "PATCH /medication_schedules/:id" do
    let(:schedule) { create(:medication_schedule, notes: "Original notes") }

    context "with valid parameters" do
      let(:new_attributes) { { notes: "Updated notes" } }

      it "updates the medication schedule" do
        patch medication_schedule_path(schedule), params: { medication_schedule: new_attributes }
        schedule.reload
        expect(schedule.notes).to eq("Updated notes")
      end
    end
  end

  describe "DELETE /medication_schedules/:id" do
    it "destroys the medication schedule" do
      schedule = create(:medication_schedule)
      expect {
        delete medication_schedule_path(schedule)
      }.to change(MedicationSchedule, :count).by(-1)
    end
  end
end
