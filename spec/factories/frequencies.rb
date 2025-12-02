FactoryBot.define do
  factory :frequency do
    how_often { %w[Daily Weekly Monthly Quarterly Annually].sample }
  end
end
