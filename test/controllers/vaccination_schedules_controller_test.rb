require "test_helper"

class VaccinationSchedulesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @vaccination_schedule = vaccination_schedules(:one)
  end

  test "should get index" do
    get vaccination_schedules_url
    assert_response :success
  end

  test "should get new" do
    get new_vaccination_schedule_url
    assert_response :success
  end

  test "should create vaccination_schedule" do
    assert_difference("VaccinationSchedule.count") do
      post vaccination_schedules_url, params: { vaccination_schedule: { date_given: @vaccination_schedule.date_given, frequency_id: @vaccination_schedule.frequency_id, notes: @vaccination_schedule.notes, pet_id: @vaccination_schedule.pet_id, vaccine_id: @vaccination_schedule.vaccine_id } }
    end

    assert_redirected_to vaccination_schedule_url(VaccinationSchedule.last)
  end

  test "should show vaccination_schedule" do
    get vaccination_schedule_url(@vaccination_schedule)
    assert_response :success
  end

  test "should get edit" do
    get edit_vaccination_schedule_url(@vaccination_schedule)
    assert_response :success
  end

  test "should update vaccination_schedule" do
    patch vaccination_schedule_url(@vaccination_schedule), params: { vaccination_schedule: { date_given: @vaccination_schedule.date_given, frequency_id: @vaccination_schedule.frequency_id, notes: @vaccination_schedule.notes, pet_id: @vaccination_schedule.pet_id, vaccine_id: @vaccination_schedule.vaccine_id } }
    assert_redirected_to vaccination_schedule_url(@vaccination_schedule)
  end

  test "should destroy vaccination_schedule" do
    assert_difference("VaccinationSchedule.count", -1) do
      delete vaccination_schedule_url(@vaccination_schedule)
    end

    assert_redirected_to vaccination_schedules_url
  end
end
