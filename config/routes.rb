Rails.application.routes.draw do
  resources :checks_schedules
  resources :pet_foods
  resources :vaccination_schedules
  resources :medication_schedules
  resources :medications
  resources :injury_reports
  resources :injuries
  resources :vaccines
  resources :checks
  resources :frequencies
  resources :foods
  resources :pets

  # API routes
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

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "pets#index"
end
