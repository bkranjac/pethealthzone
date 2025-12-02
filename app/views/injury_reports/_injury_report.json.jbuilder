json.extract! injury_report, :id, :pet_id, :injury_id, :body_part, :description, :date, :created_at, :updated_at
json.url injury_report_url(injury_report, format: :json)
