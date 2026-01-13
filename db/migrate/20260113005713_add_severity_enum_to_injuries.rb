class AddSeverityEnumToInjuries < ActiveRecord::Migration[8.1]
  def up
    # Add new integer column for enum
    add_column :injuries, :severity_enum, :integer, default: 1  # 1 = moderate

    # Migrate existing string data to enum
    # minor -> 0, moderate -> 1, severe -> 2, critical -> 3
    execute <<-SQL
      UPDATE injuries
      SET severity_enum = CASE
        WHEN LOWER(severity) = 'minor' THEN 0
        WHEN LOWER(severity) = 'moderate' THEN 1
        WHEN LOWER(severity) = 'severe' THEN 2
        WHEN LOWER(severity) = 'critical' THEN 3
        ELSE 1
      END
    SQL

    # Remove old string column
    remove_column :injuries, :severity

    # Rename new column to severity
    rename_column :injuries, :severity_enum, :severity
  end

  def down
    # Add back string column
    add_column :injuries, :severity_string, :string, limit: 20

    # Migrate enum back to string
    execute <<-SQL
      UPDATE injuries
      SET severity_string = CASE severity
        WHEN 0 THEN 'minor'
        WHEN 1 THEN 'moderate'
        WHEN 2 THEN 'severe'
        WHEN 3 THEN 'critical'
        ELSE 'moderate'
      END
    SQL

    # Remove enum column
    remove_column :injuries, :severity

    # Rename back
    rename_column :injuries, :severity_string, :severity
  end
end
