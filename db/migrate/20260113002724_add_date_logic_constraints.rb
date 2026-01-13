class AddDateLogicConstraints < ActiveRecord::Migration[8.1]
  def change
    # Medication schedules - ensure date_ended >= date_started
    add_check_constraint :medication_schedules,
      "date_ended IS NULL OR date_ended >= date_started",
      name: "check_medication_schedule_dates"

    # Vaccination schedules - prevent future vaccinations
    add_check_constraint :vaccination_schedules,
      "date_given <= CURRENT_DATE",
      name: "check_vaccination_date_not_future"

    # Pet adoptions - prevent future adoption dates
    add_check_constraint :pet_adoptions,
      "adoption_date <= CURRENT_DATE",
      name: "check_adoption_date_not_future"

    # Injury reports - prevent future injury dates
    add_check_constraint :injury_reports,
      "date <= CURRENT_DATE",
      name: "check_injury_date_not_future"
  end
end
