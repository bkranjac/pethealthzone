require "test_helper"

class InjuryReportsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @injury_report = injury_reports(:one)
  end

  test "should get index" do
    get injury_reports_url
    assert_response :success
  end

  test "should get new" do
    get new_injury_report_url
    assert_response :success
  end

  test "should create injury_report" do
    assert_difference("InjuryReport.count") do
      post injury_reports_url, params: { injury_report: { body_part: @injury_report.body_part, date: @injury_report.date, description: @injury_report.description, injury_id: @injury_report.injury_id, pet_id: @injury_report.pet_id } }
    end

    assert_redirected_to injury_report_url(InjuryReport.last)
  end

  test "should show injury_report" do
    get injury_report_url(@injury_report)
    assert_response :success
  end

  test "should get edit" do
    get edit_injury_report_url(@injury_report)
    assert_response :success
  end

  test "should update injury_report" do
    patch injury_report_url(@injury_report), params: { injury_report: { body_part: @injury_report.body_part, date: @injury_report.date, description: @injury_report.description, injury_id: @injury_report.injury_id, pet_id: @injury_report.pet_id } }
    assert_redirected_to injury_report_url(@injury_report)
  end

  test "should destroy injury_report" do
    assert_difference("InjuryReport.count", -1) do
      delete injury_report_url(@injury_report)
    end

    assert_redirected_to injury_reports_url
  end
end
