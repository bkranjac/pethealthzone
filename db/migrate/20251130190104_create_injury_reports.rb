class CreateInjuryReports < ActiveRecord::Migration[8.0]
  def change
    create_table :injury_reports do |t|
      t.references :pet, null: false, foreign_key: true
      t.references :injury, null: false, foreign_key: true
      t.string :body_part
      t.text :description
      t.date :date

      t.timestamps
    end
  end
end
