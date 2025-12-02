class AddNotesToMedicationSchedules < ActiveRecord::Migration[8.0]
  def change
    add_column :medication_schedules, :notes, :text
  end
end
