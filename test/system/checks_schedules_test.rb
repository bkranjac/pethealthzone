require "application_system_test_case"

class ChecksSchedulesTest < ApplicationSystemTestCase
  setup do
    @checks_schedule = checks_schedules(:one)
  end

  test "visiting the index" do
    visit checks_schedules_url
    assert_selector "h1", text: "Checks schedules"
  end

  test "should create checks schedule" do
    visit checks_schedules_url
    click_on "New checks schedule"

    select @checks_schedule.pet.name, from: "Pet"
    select @checks_schedule.check.check_type, from: "Check"
    fill_in "Date created", with: @checks_schedule.date_created
    fill_in "Notes", with: @checks_schedule.notes
    check "Performed" if @checks_schedule.performed
    click_on "Create Checks schedule"

    assert_text "Checks schedule was successfully created"
    click_on "Back"
  end

  test "should update Checks schedule" do
    visit checks_schedule_url(@checks_schedule)
    click_on "Edit this checks schedule", match: :first

    select @checks_schedule.pet.name, from: "Pet"
    select @checks_schedule.check.check_type, from: "Check"
    fill_in "Date created", with: @checks_schedule.date_created
    fill_in "Notes", with: @checks_schedule.notes
    check "Performed" if @checks_schedule.performed
    click_on "Update Checks schedule"

    assert_text "Checks schedule was successfully updated"
    click_on "Back"
  end

  test "should destroy Checks schedule" do
    visit checks_schedule_url(@checks_schedule)
    click_on "Destroy this checks schedule", match: :first

    assert_text "Checks schedule was successfully destroyed"
  end
end
