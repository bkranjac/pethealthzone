class CreateMedications < ActiveRecord::Migration[8.0]
  def change
    create_table :medications do |t|
      t.string :name
      t.string :amount
      t.text :purpose
      t.date :expiration_date

      t.timestamps
    end
  end
end
