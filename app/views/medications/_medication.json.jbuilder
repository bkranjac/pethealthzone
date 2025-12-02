json.extract! medication, :id, :name, :amount, :purpose, :expiration_date, :created_at, :updated_at
json.url medication_url(medication, format: :json)
