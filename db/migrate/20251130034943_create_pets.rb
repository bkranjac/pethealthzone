class CreatePets < ActiveRecord::Migration[8.0]
  def change
    create_table :pets do |t|
      t.string :pet_type
      t.string :breed
      t.string :picture
      t.date :birthday
      t.string :name
      t.string :nickname
      t.date :date_admitted
      t.text :notes

      t.timestamps
    end
  end
end
