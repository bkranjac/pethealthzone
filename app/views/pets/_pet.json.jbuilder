json.extract! pet, :id, :pet_type, :breed, :picture, :birthday, :name, :nickname, :date_admitted, :notes, :created_at, :updated_at
json.url pet_url(pet, format: :json)
