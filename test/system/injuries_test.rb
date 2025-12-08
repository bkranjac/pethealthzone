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
    select @injury.severity, from: "Severity"
    click_on "Create Injury"

    # Verify we're on the show page
    assert_selector "h1", text: /Injury #\d+/
    click_on "Back"
  end

  test "should update Injury" do
    visit injury_url(@injury)
    click_on "Edit this injury", match: :first

    fill_in "Description", with: "Updated description"
    select "Critical", from: "Severity"
    click_on "Update Injury"

    # Verify we're back on the show page with updated data
    assert_text "Updated description"
    assert_text "Critical"
  end

  test "should destroy Injury" do
    visit injuries_url
    injury_count = all(".bg-white.shadow.rounded-lg").count

    visit injury_url(@injury)
    accept_confirm do
      click_on "Destroy this injury", match: :first
    end

    # Verify we're redirected to index and injury is gone
    assert_selector "h1", text: "Injuries"
    assert_equal injury_count - 1, all(".bg-white.shadow.rounded-lg").count
  end
end
