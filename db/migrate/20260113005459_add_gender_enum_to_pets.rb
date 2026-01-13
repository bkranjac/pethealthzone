class AddGenderEnumToPets < ActiveRecord::Migration[8.1]
  def up
    # Add new integer column for enum
    add_column :pets, :gender_enum, :integer, default: 2  # 2 = unknown

    # Migrate existing string data to enum
    # male -> 0, female -> 1, anything else -> 2 (unknown)
    execute <<-SQL
      UPDATE pets
      SET gender_enum = CASE
        WHEN LOWER(gender) IN ('male', 'm') THEN 0
        WHEN LOWER(gender) IN ('female', 'f') THEN 1
        ELSE 2
      END
    SQL

    # Remove old string column
    remove_column :pets, :gender

    # Rename new column to gender
    rename_column :pets, :gender_enum, :gender
  end

  def down
    # Add back string column
    add_column :pets, :gender_string, :string, limit: 20

    # Migrate enum back to string
    execute <<-SQL
      UPDATE pets
      SET gender_string = CASE gender
        WHEN 0 THEN 'male'
        WHEN 1 THEN 'female'
        ELSE 'unknown'
      END
    SQL

    # Remove enum column
    remove_column :pets, :gender

    # Rename back
    rename_column :pets, :gender_string, :gender
  end
end
