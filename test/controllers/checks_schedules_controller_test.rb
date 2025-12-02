require "test_helper"

class ChecksSchedulesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @checks_schedule = checks_schedules(:one)
  end

  test "should get index" do
    get checks_schedules_url
    assert_response :success
  end

  test "should get new" do
    get new_checks_schedule_url
    assert_response :success
  end

  test "should create checks_schedule" do
    assert_difference("ChecksSchedule.count") do
      post checks_schedules_url, params: { checks_schedule: { check_id: @checks_schedule.check_id, date_created: @checks_schedule.date_created, notes: @checks_schedule.notes, performed: @checks_schedule.performed, pet_id: @checks_schedule.pet_id } }
    end

    assert_redirected_to checks_schedule_url(ChecksSchedule.last)
  end

  test "should show checks_schedule" do
    get checks_schedule_url(@checks_schedule)
    assert_response :success
  end

  test "should get edit" do
    get edit_checks_schedule_url(@checks_schedule)
    assert_response :success
  end

  test "should update checks_schedule" do
    patch checks_schedule_url(@checks_schedule), params: { checks_schedule: { check_id: @checks_schedule.check_id, date_created: @checks_schedule.date_created, notes: @checks_schedule.notes, performed: @checks_schedule.performed, pet_id: @checks_schedule.pet_id } }
    assert_redirected_to checks_schedule_url(@checks_schedule)
  end

  test "should destroy checks_schedule" do
    assert_difference("ChecksSchedule.count", -1) do
      delete checks_schedule_url(@checks_schedule)
    end

    assert_redirected_to checks_schedules_url
  end
end
