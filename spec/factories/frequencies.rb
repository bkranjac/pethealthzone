FactoryBot.define do
  factory :frequency do
    name { %w[Daily Weekly Monthly Quarterly Annually].sample }
    interval_days { [ 1, 7, 30, 90, 365 ].sample }
  end
end
