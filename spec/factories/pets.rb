FactoryBot.define do
  factory :pet do
    pet_type { %w[Dog Cat Bird Fish].sample }
    gender { %w[Male Female].sample }
    breed { Faker::Creature::Dog.breed }
    picture { "https://placekitten.com/200/200" }
    birthday { Faker::Date.birthday(min_age: 1, max_age: 15) }
    name { Faker::Creature::Dog.name }
    nickname { Faker::Name.first_name }
    date_admitted { Faker::Date.between(from: 2.years.ago, to: Date.today) }
    notes { Faker::Lorem.paragraph }
  end
end
