class UpdateFrequenciesSchema < ActiveRecord::Migration[8.1]
  def up
    rename_column :frequencies, :how_often, :name
    add_column :frequencies, :interval_days, :integer

    #Set all NULL values to 1 as default (users can update manually)
    Frequency.where(interval_days: nil).update_all(interval_days: 1)

    change_column_null :frequencies, :interval_days, false
  end

  def down
    rename_column :frequencies, :name, :how_often
    remove_column :frequencies, :interval_days
  end
end
