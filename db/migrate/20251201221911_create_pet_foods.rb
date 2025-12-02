class CreatePetFoods < ActiveRecord::Migration[8.0]
  def change
    create_table :pet_foods do |t|
      t.references :pet, null: false, foreign_key: true
      t.references :food, null: false, foreign_key: true
      t.date :started_at
      t.references :frequency, null: false, foreign_key: true
      t.text :notes

      t.timestamps
    end
  end
end
