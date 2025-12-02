class CreateVaccines < ActiveRecord::Migration[8.0]
  def change
    create_table :vaccines do |t|
      t.string :name
      t.references :frequency, null: false, foreign_key: true
      t.boolean :mandatory

      t.timestamps
    end
  end
end
