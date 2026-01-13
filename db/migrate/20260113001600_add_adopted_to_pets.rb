class AddAdoptedToPets < ActiveRecord::Migration[8.1]
  def change
    add_column :pets, :adopted, :boolean, default: false, null: false
  end
end
