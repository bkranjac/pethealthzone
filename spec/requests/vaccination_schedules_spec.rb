require 'rails_helper'

RSpec.describe "VaccinationSchedules", type: :request do
  describe "GET /vaccination_schedules" do
    it "returns a successful response" do
      get vaccination_schedules_path
      expect(response).to be_successful
    end

    it "displays all vaccination schedules" do
      schedule1 = create(:vaccination_schedule)
      schedule2 = create(:vaccination_schedule)

      get vaccination_schedules_path
      expect(response).to be_successful
    end
  end

  describe "GET /vaccination_schedules/:id" do
    it "returns a successful response" do
      schedule = create(:vaccination_schedule)
      get vaccination_schedule_path(schedule)
      expect(response).to be_successful
    end
  end

  describe "POST /vaccination_schedules" do
    let(:pet) { create(:pet) }
    let(:vaccine) { create(:vaccine) }
    let(:frequency) { create(:frequency) }

    context "with valid parameters" do
      let(:valid_attributes) do
        {
          pet_id: pet.id,
          vaccine_id: vaccine.id,
          frequency_id: frequency.id,
          date_given: Date.today,
          notes: "No adverse reactions"
        }
      end

      it "creates a new vaccination schedule" do
        expect {
          post vaccination_schedules_path, params: { vaccination_schedule: valid_attributes }
        }.to change(VaccinationSchedule, :count).by(1)
      end

      it "redirects to the created vaccination schedule" do
        post vaccination_schedules_path, params: { vaccination_schedule: valid_attributes }
        expect(response).to redirect_to(VaccinationSchedule.last)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { date_given: nil } }

      it "does not create a new vaccination schedule" do
        expect {
          post vaccination_schedules_path, params: { vaccination_schedule: invalid_attributes }
        }.not_to change(VaccinationSchedule, :count)
      end
    end
  end

  describe "PATCH /vaccination_schedules/:id" do
    let(:schedule) { create(:vaccination_schedule, notes: "Original notes") }

    context "with valid parameters" do
      let(:new_attributes) { { notes: "Updated notes" } }

      it "updates the vaccination schedule" do
        patch vaccination_schedule_path(schedule), params: { vaccination_schedule: new_attributes }
        schedule.reload
        expect(schedule.notes).to eq("Updated notes")
      end
    end
  end

  describe "DELETE /vaccination_schedules/:id" do
    it "destroys the vaccination schedule" do
      schedule = create(:vaccination_schedule)
      expect {
        delete vaccination_schedule_path(schedule)
      }.to change(VaccinationSchedule, :count).by(-1)
    end
  end
end
