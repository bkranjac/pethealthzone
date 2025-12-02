require "application_system_test_case"

class MedicationSchedulesTest < ApplicationSystemTestCase
  setup do
    @medication_schedule = medication_schedules(:one)
  end

  test "visiting the index" do
    visit medication_schedules_url
    assert_selector "h1", text: "Medication schedules"
  end

  test "should create medication schedule" do
    visit medication_schedules_url
    click_on "New medication schedule"

    fill_in "Date ended", with: @medication_schedule.date_ended
    fill_in "Date started", with: @medication_schedule.date_started
    fill_in "Frequency", with: @medication_schedule.frequency_id
    fill_in "Medication", with: @medication_schedule.medication_id
    fill_in "Pet", with: @medication_schedule.pet_id
    click_on "Create Medication schedule"

    assert_text "Medication schedule was successfully created"
    click_on "Back"
  end

  test "should update Medication schedule" do
    visit medication_schedule_url(@medication_schedule)
    click_on "Edit this medication schedule", match: :first

    fill_in "Date ended", with: @medication_schedule.date_ended
    fill_in "Date started", with: @medication_schedule.date_started
    fill_in "Frequency", with: @medication_schedule.frequency_id
    fill_in "Medication", with: @medication_schedule.medication_id
    fill_in "Pet", with: @medication_schedule.pet_id
    click_on "Update Medication schedule"

    assert_text "Medication schedule was successfully updated"
    click_on "Back"
  end

  test "should destroy Medication schedule" do
    visit medication_schedule_url(@medication_schedule)
    click_on "Destroy this medication schedule", match: :first

    assert_text "Medication schedule was successfully destroyed"
  end
end
