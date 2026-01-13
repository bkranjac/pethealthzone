class AddUniqueConstraints < ActiveRecord::Migration[8.1]
  def change
    # Frequencies - ensure unique names
    add_index :frequencies, :name, unique: true, name: "index_frequencies_on_name_unique"

    # Vaccines - ensure unique names
    add_index :vaccines, :name, unique: true, name: "index_vaccines_on_name_unique"

    # Vaccination schedules - prevent duplicate vaccinations on same day
    add_index :vaccination_schedules, [:pet_id, :vaccine_id, :date_given],
      unique: true,
      name: "index_vaccination_schedules_unique"
  end
end
