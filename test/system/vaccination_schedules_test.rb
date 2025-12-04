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

    select @vaccination_schedule.pet.name, from: "Pet"
    select @vaccination_schedule.vaccine.name, from: "Vaccine"
    select @vaccination_schedule.frequency.how_often, from: "Frequency"
    fill_in "Date given", with: @vaccination_schedule.date_given
    fill_in "Notes", with: @vaccination_schedule.notes
    click_on "Create Vaccination schedule"

    assert_text "Vaccination schedule was successfully created"
    click_on "Back"
  end

  test "should update Vaccination schedule" do
    visit vaccination_schedule_url(@vaccination_schedule)
    click_on "Edit this vaccination schedule", match: :first

    select @vaccination_schedule.pet.name, from: "Pet"
    select @vaccination_schedule.vaccine.name, from: "Vaccine"
    select @vaccination_schedule.frequency.how_often, from: "Frequency"
    fill_in "Date given", with: @vaccination_schedule.date_given
    fill_in "Notes", with: @vaccination_schedule.notes
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
