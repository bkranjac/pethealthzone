require "application_system_test_case"

class InjuryReportsTest < ApplicationSystemTestCase
  setup do
    @injury_report = injury_reports(:one)
  end

  test "visiting the index" do
    visit injury_reports_url
    assert_selector "h1", text: "Injury reports"
  end

  test "should create injury report" do
    visit injury_reports_url
    click_on "New injury report"

    select @injury_report.pet.name, from: "Pet"
    select @injury_report.injury.description, from: "Injury"
    fill_in "Body part", with: @injury_report.body_part
    fill_in "Description", with: @injury_report.description
    fill_in "Date", with: @injury_report.date
    click_on "Create Injury report"

    assert_text "Injury report was successfully created"
    click_on "Back"
  end

  test "should update Injury report" do
    visit injury_report_url(@injury_report)
    click_on "Edit this injury report", match: :first

    select @injury_report.pet.name, from: "Pet"
    select @injury_report.injury.description, from: "Injury"
    fill_in "Body part", with: @injury_report.body_part
    fill_in "Description", with: @injury_report.description
    fill_in "Date", with: @injury_report.date
    click_on "Update Injury report"

    assert_text "Injury report was successfully updated"
    click_on "Back"
  end

  test "should destroy Injury report" do
    visit injury_report_url(@injury_report)
    click_on "Destroy this injury report", match: :first

    assert_text "Injury report was successfully destroyed"
  end
end
