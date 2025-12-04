FactoryBot.define do
  factory :injury_report do
    association :pet
    association :injury
    body_part { %w[Leg Tail Head Paw Back Chest].sample }
    description { Faker::Lorem.sentence }
    date { Faker::Date.between(from: 1.year.ago, to: Date.today) }
  end

  factory :medication_schedule do
    association :pet
    association :medication
    association :frequency
    date_started { Faker::Date.between(from: 1.year.ago, to: Date.today) }
    date_ended { Faker::Date.forward(days: 365) }
    notes { Faker::Lorem.paragraph }
  end

  factory :vaccination_schedule do
    association :pet
    association :vaccine
    association :frequency
    date_given { Faker::Date.between(from: 1.year.ago, to: Date.today) }
    notes { Faker::Lorem.paragraph }
  end

  factory :pet_food do
    association :pet
    association :food
    association :frequency
    started_at { Faker::Date.between(from: 1.year.ago, to: Date.today) }
    notes { Faker::Lorem.paragraph }
  end

  factory :checks_schedule do
    association :pet
    association :check
    date_created { Faker::Date.between(from: 1.year.ago, to: Date.today) }
    notes { Faker::Lorem.paragraph }
    performed { [ true, false ].sample }
  end
end
