class CreateFrequencies < ActiveRecord::Migration[8.0]
  def change
    create_table :frequencies do |t|
      t.string :how_often

      t.timestamps
    end
  end
end
