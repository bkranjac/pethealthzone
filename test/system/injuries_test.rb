require "application_system_test_case"

class InjuriesTest < ApplicationSystemTestCase
  setup do
    @injury = injuries(:one)
  end

  test "visiting the index" do
    visit injuries_url
    assert_selector "h1", text: "Injuries"
  end

  test "should create injury" do
    visit injuries_url
    click_on "New injury"

    fill_in "Description", with: @injury.description
    fill_in "Severity", with: @injury.severity
    click_on "Create Injury"

    assert_text "Injury was successfully created"
    click_on "Back"
  end

  test "should update Injury" do
    visit injury_url(@injury)
    click_on "Edit this injury", match: :first

    fill_in "Description", with: @injury.description
    fill_in "Severity", with: @injury.severity
    click_on "Update Injury"

    assert_text "Injury was successfully updated"
    click_on "Back"
  end

  test "should destroy Injury" do
    visit injury_url(@injury)
    click_on "Destroy this injury", match: :first

    assert_text "Injury was successfully destroyed"
  end
end
