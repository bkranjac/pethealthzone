require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [ 1400, 1400 ]

  # Increase wait time for React components to load and make API calls
  Capybara.default_max_wait_time = 10

  # Disable parallel execution for system tests to avoid database isolation issues
  # System tests make API calls from the browser which need to see the same database state
  parallelize(workers: 1)

  # Disable transactional fixtures for system tests
  # The test server runs in a separate thread and can't see uncommitted transactions
  self.use_transactional_tests = false

  # Load fixtures
  fixtures :all
end
