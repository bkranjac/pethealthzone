class AddStringLengthLimits < ActiveRecord::Migration[8.1]
  def change
    # Pets table
    change_column :pets, :name, :string, limit: 100
    change_column :pets, :nickname, :string, limit: 100
    change_column :pets, :pet_type, :string, limit: 50
    change_column :pets, :breed, :string, limit: 100
    change_column :pets, :gender, :string, limit: 20
    change_column :pets, :picture, :string, limit: 255

    # Locations table
    change_column :locations, :name, :string, limit: 100
    change_column :locations, :address, :string, limit: 255
    change_column :locations, :phone_number, :string, limit: 20

    # Medications table
    change_column :medications, :name, :string, limit: 100
    change_column :medications, :amount, :string, limit: 50

    # Foods table
    change_column :foods, :name, :string, limit: 100
    change_column :foods, :food_type, :string, limit: 50
    change_column :foods, :amount, :string, limit: 50
    change_column :foods, :purpose, :string, limit: 100

    # Vaccines table
    change_column :vaccines, :name, :string, limit: 100

    # Checks table
    change_column :checks, :check_type, :string, limit: 100

    # Frequencies table
    change_column :frequencies, :name, :string, limit: 50

    # Injuries table
    change_column :injuries, :severity, :string, limit: 20

    # Injury reports table
    change_column :injury_reports, :body_part, :string, limit: 100
  end
end
