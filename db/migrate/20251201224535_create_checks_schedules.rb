class CreateChecksSchedules < ActiveRecord::Migration[8.0]
  def change
    create_table :checks_schedules do |t|
      t.references :pet, null: false, foreign_key: true
      t.references :check, null: false, foreign_key: true
      t.date :date_created
      t.text :notes
      t.boolean :performed

      t.timestamps
    end
  end
end
