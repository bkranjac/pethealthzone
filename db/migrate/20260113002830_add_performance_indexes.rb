class AddPerformanceIndexes < ActiveRecord::Migration[8.1]
  def change
    # Pets table - common filter columns
    add_index :pets, :adopted, name: "index_pets_on_adopted"
    add_index :pets, :pet_type, name: "index_pets_on_pet_type"
    add_index :pets, :name, name: "index_pets_on_name"

    # Vaccination schedules - date queries
    add_index :vaccination_schedules, :date_given, name: "index_vaccination_schedules_on_date_given"

    # Medication schedules - date queries
    add_index :medication_schedules, :date_started, name: "index_medication_schedules_on_date_started"
    add_index :medication_schedules, :date_ended, name: "index_medication_schedules_on_date_ended"

    # Checks schedules - filter incomplete checks
    add_index :checks_schedules, :performed, name: "index_checks_schedules_on_performed"

    # Injury reports - date queries
    add_index :injury_reports, :date, name: "index_injury_reports_on_date"

    # Composite indexes for common query patterns
    add_index :medication_schedules, [:pet_id, :date_started], name: "index_medication_schedules_on_pet_and_date"
    add_index :vaccination_schedules, [:pet_id, :date_given], name: "index_vaccination_schedules_on_pet_and_date"
    add_index :checks_schedules, [:pet_id, :performed], name: "index_checks_schedules_on_pet_and_performed"
    add_index :pets, [:adopted, :location_id], name: "index_pets_on_adopted_and_location"
  end
end
