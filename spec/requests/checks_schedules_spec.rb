require 'rails_helper'

RSpec.describe "ChecksSchedules", type: :request do
  describe "GET /checks_schedules" do
    it "returns a successful response" do
      get checks_schedules_path
      expect(response).to be_successful
    end

    it "displays all checks schedules" do
      schedule1 = create(:checks_schedule)
      schedule2 = create(:checks_schedule)

      get checks_schedules_path
      expect(response).to be_successful
    end
  end

  describe "GET /checks_schedules/:id" do
    it "returns a successful response" do
      schedule = create(:checks_schedule)
      get checks_schedule_path(schedule)
      expect(response).to be_successful
    end
  end

  describe "POST /checks_schedules" do
    let(:pet) { create(:pet) }
    let(:check) { create(:check) }

    context "with valid parameters" do
      let(:valid_attributes) do
        {
          pet_id: pet.id,
          check_id: check.id,
          date_created: Date.today,
          notes: "Check completed successfully",
          performed: true
        }
      end

      it "creates a new checks schedule" do
        expect {
          post checks_schedules_path, params: { checks_schedule: valid_attributes }
        }.to change(ChecksSchedule, :count).by(1)
      end

      it "redirects to the created checks schedule" do
        post checks_schedules_path, params: { checks_schedule: valid_attributes }
        expect(response).to redirect_to(ChecksSchedule.last)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { date_created: nil } }

      it "does not create a new checks schedule" do
        expect {
          post checks_schedules_path, params: { checks_schedule: invalid_attributes }
        }.not_to change(ChecksSchedule, :count)
      end
    end
  end

  describe "PATCH /checks_schedules/:id" do
    let(:schedule) { create(:checks_schedule, performed: false) }

    context "with valid parameters" do
      let(:new_attributes) { { performed: true } }

      it "updates the checks schedule" do
        patch checks_schedule_path(schedule), params: { checks_schedule: new_attributes }
        schedule.reload
        expect(schedule.performed).to eq(true)
      end
    end
  end

  describe "DELETE /checks_schedules/:id" do
    it "destroys the checks schedule" do
      schedule = create(:checks_schedule)
      expect {
        delete checks_schedule_path(schedule)
      }.to change(ChecksSchedule, :count).by(-1)
    end
  end
end
