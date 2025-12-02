class CreateMedicationSchedules < ActiveRecord::Migration[8.0]
  def change
    create_table :medication_schedules do |t|
      t.references :pet, null: false, foreign_key: true
      t.references :medication, null: false, foreign_key: true
      t.references :frequency, null: false, foreign_key: true
      t.date :date_started
      t.date :date_ended

      t.timestamps
    end
  end
end
