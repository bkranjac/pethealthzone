FactoryBot.define do
  factory :pet_adoption do
    pet { nil }
    adoption_date { "2026-01-12" }
    adoption_fee { "9.99" }
    contact_info { "MyText" }
  end
end
