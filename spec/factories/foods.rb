FactoryBot.define do
  factory :food do
    name { Faker::Food.dish }
    food_type { %w[Dry Wet Raw Homemade].sample }
    amount { "#{rand(100..500)} grams" }
    description { Faker::Lorem.sentence }
    purpose { %w[Maintenance Growth Senior].sample }
    notes { Faker::Lorem.paragraph }
  end
end
