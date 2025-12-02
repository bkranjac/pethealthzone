FactoryBot.define do
  factory :medication do
    name { Faker::Science.element }
    amount { "#{rand(5..100)}mg" }
    purpose { Faker::Lorem.sentence }
    expiration_date { Faker::Date.forward(days: 365) }
  end
end
