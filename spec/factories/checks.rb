FactoryBot.define do
  factory :check do
    association :frequency
    check_type { %w[Physical Dental Eye Ear Skin Blood].sample }
  end
end
