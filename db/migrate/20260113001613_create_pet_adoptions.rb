class CreatePetAdoptions < ActiveRecord::Migration[8.1]
  def change
    create_table :pet_adoptions do |t|
      t.references :pet, null: false, foreign_key: true
      t.date :adoption_date
      t.decimal :adoption_fee, precision: 10, scale: 2
      t.text :contact_info

      t.timestamps
    end
  end
end
