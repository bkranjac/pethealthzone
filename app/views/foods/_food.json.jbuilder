json.extract! food, :id, :name, :food_type, :amount, :description, :purpose, :notes, :created_at, :updated_at
json.url food_url(food, format: :json)
