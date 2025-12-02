json.extract! medication_schedule, :id, :pet_id, :medication_id, :frequency_id, :date_started, :date_ended, :created_at, :updated_at
json.url medication_schedule_url(medication_schedule, format: :json)
