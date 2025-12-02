FactoryBot.define do
  factory :injury do
    description { Faker::Lorem.sentence }
    severity { %w[Mild Moderate Severe Critical].sample }
  end
end
