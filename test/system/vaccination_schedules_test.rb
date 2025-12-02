require "application_system_test_case"

class VaccinationSchedulesTest < ApplicationSystemTestCase
  setup do
    @vaccination_schedule = vaccination_schedules(:one)
  end

  test "visiting the index" do
    visit vaccination_schedules_url
    assert_selector "h1", text: "Vaccination schedules"
  end

  test "should create vaccination schedule" do
    visit vaccination_schedules_url
    click_on "New vaccination schedule"

    fill_in "Date given", with: @vaccination_schedule.date_given
    fill_in "Frequency", with: @vaccination_schedule.frequency_id
    fill_in "Notes", with: @vaccination_schedule.notes
    fill_in "Pet", with: @vaccination_schedule.pet_id
    fill_in "Vaccine", with: @vaccination_schedule.vaccine_id
    click_on "Create Vaccination schedule"

    assert_text "Vaccination schedule was successfully created"
    click_on "Back"
  end

  test "should update Vaccination schedule" do
    visit vaccination_schedule_url(@vaccination_schedule)
    click_on "Edit this vaccination schedule", match: :first

    fill_in "Date given", with: @vaccination_schedule.date_given
    fill_in "Frequency", with: @vaccination_schedule.frequency_id
    fill_in "Notes", with: @vaccination_schedule.notes
    fill_in "Pet", with: @vaccination_schedule.pet_id
    fill_in "Vaccine", with: @vaccination_schedule.vaccine_id
    click_on "Update Vaccination schedule"

    assert_text "Vaccination schedule was successfully updated"
    click_on "Back"
  end

  test "should destroy Vaccination schedule" do
    visit vaccination_schedule_url(@vaccination_schedule)
    click_on "Destroy this vaccination schedule", match: :first

    assert_text "Vaccination schedule was successfully destroyed"
  end
end
