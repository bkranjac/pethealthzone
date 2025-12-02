json.extract! vaccination_schedule, :id, :pet_id, :vaccine_id, :frequency_id, :date_given, :notes, :created_at, :updated_at
json.url vaccination_schedule_url(vaccination_schedule, format: :json)
