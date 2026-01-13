class AddNotNullConstraintsPhase1 < ActiveRecord::Migration[8.1]
  def change
    # Pets table - make validated fields NOT NULL
    change_column_null :pets, :name, false
    change_column_null :pets, :pet_type, false
    change_column_null :pets, :birthday, false
    change_column_null :pets, :date_admitted, false

    # Pet adoptions - make adoption_date NOT NULL
    change_column_null :pet_adoptions, :adoption_date, false

    # Checks schedules - make critical fields NOT NULL
    change_column_null :checks_schedules, :date_created, false
    change_column_null :checks_schedules, :performed, false

    # Medication schedules - make date_started NOT NULL
    change_column_null :medication_schedules, :date_started, false

    # Vaccination schedules - make date_given NOT NULL
    change_column_null :vaccination_schedules, :date_given, false

    # Vaccines - make name and mandatory NOT NULL
    change_column_null :vaccines, :name, false
    change_column_null :vaccines, :mandatory, false

    # Checks - make check_type NOT NULL
    change_column_null :checks, :check_type, false

    # Foods - make validated fields NOT NULL
    change_column_null :foods, :name, false
    change_column_null :foods, :food_type, false
    change_column_null :foods, :amount, false

    # Medications - make validated fields NOT NULL
    change_column_null :medications, :name, false
    change_column_null :medications, :amount, false

    # Frequencies - make name NOT NULL
    change_column_null :frequencies, :name, false

    # Locations - make name NOT NULL
    change_column_null :locations, :name, false
  end
end
