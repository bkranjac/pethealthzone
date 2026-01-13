class AddSoftDeleteSupport < ActiveRecord::Migration[8.1]
  def change
    # Add deleted_at to tables that should support soft delete
    add_column :pets, :deleted_at, :datetime
    add_index :pets, :deleted_at

    add_column :medications, :deleted_at, :datetime
    add_index :medications, :deleted_at

    add_column :vaccines, :deleted_at, :datetime
    add_index :vaccines, :deleted_at

    add_column :foods, :deleted_at, :datetime
    add_index :foods, :deleted_at

    add_column :locations, :deleted_at, :datetime
    add_index :locations, :deleted_at
  end
end
