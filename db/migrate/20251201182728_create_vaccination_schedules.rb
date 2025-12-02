class CreateVaccinationSchedules < ActiveRecord::Migration[8.0]
  def change
    create_table :vaccination_schedules do |t|
      t.references :pet, null: false, foreign_key: true
      t.references :vaccine, null: false, foreign_key: true
      t.references :frequency, null: false, foreign_key: true
      t.date :date_given
      t.text :notes

      t.timestamps
    end
  end
end
