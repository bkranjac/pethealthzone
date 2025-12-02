class CreateInjuries < ActiveRecord::Migration[8.0]
  def change
    create_table :injuries do |t|
      t.text :description
      t.string :severity

      t.timestamps
    end
  end
end
