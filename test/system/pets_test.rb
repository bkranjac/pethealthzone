require "application_system_test_case"

class PetsTest < ApplicationSystemTestCase
  setup do
    @pet = pets(:one)
  end

  test "visiting the index" do
    visit pets_url
    assert_selector "h1", text: "Pets"
  end

  test "should create pet" do
    visit pets_url
    click_on "New pet"

    # Fill in only required fields
    fill_in "Name", with: "New Test Pet"
    fill_in "Type", with: "Dog"
    fill_in "Birthday", with: "2020-01-15"
    fill_in "Date Admitted", with: "2024-01-01"
    click_on "Create Pet"

    # Verify we're on the show page with the pet name
    assert_selector "h1", text: "New Test Pet"
    click_on "Back"
  end

  test "should update Pet" do
    visit pet_url(@pet)
    click_on "Edit this pet", match: :first

    fill_in "Name", with: "Updated Pet Name"
    fill_in "Type", with: "Cat"
    click_on "Update Pet"

    # Verify we're back on the show page with updated data
    assert_selector "h1", text: "Updated Pet Name"
    assert_text "Cat"
  end

  test "should destroy Pet" do
    visit pets_url
    pet_count = all(".border.rounded-lg").count

    visit pet_url(@pet)
    accept_confirm do
      click_on "Destroy this pet", match: :first
    end

    # Verify we're redirected to index and pet is gone
    assert_selector "h1", text: "Pets"
    assert_equal pet_count - 1, all(".border.rounded-lg").count
  end
end
