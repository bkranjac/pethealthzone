class CreateChecks < ActiveRecord::Migration[8.0]
  def change
    create_table :checks do |t|
      t.string :check_type
      t.references :frequency, null: false, foreign_key: true

      t.timestamps
    end
  end
end
