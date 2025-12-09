Rails.application.routes.draw do
  # API routes - keep these unchanged
  namespace :api do
    namespace :v1 do
      resources :pets
      resources :foods
      resources :frequencies
      resources :checks
      resources :vaccines
      resources :injuries
      resources :medications
      resources :injury_reports
      resources :medication_schedules
      resources :vaccination_schedules
      resources :pet_foods
      resources :checks_schedules
    end
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check

  # SPA catch-all route (must be last!)
  # This serves the React SPA for all non-API HTML requests
  get "*path", to: "spa#index", constraints: ->(req) {
    !req.xhr? && req.format.html?
  }

  # Root serves the SPA
  root "spa#index"
end
