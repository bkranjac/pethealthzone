class AddGenderToPets < ActiveRecord::Migration[8.0]
  def change
    add_column :pets, :gender, :string
  end
end
