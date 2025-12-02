class CreateFoods < ActiveRecord::Migration[8.0]
  def change
    create_table :foods do |t|
      t.string :name
      t.string :food_type
      t.string :amount
      t.text :description
      t.string :purpose
      t.text :notes

      t.timestamps
    end
  end
end
