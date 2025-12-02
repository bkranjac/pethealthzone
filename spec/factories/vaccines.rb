FactoryBot.define do
  factory :vaccine do
    association :frequency
    name { %w[Rabies Distemper Parvovirus Bordetella Leptospirosis].sample }
    mandatory { [true, false].sample }
  end
end
