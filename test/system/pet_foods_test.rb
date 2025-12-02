require "application_system_test_case"

class PetFoodsTest < ApplicationSystemTestCase
  setup do
    @pet_food = pet_foods(:one)
  end

  test "visiting the index" do
    visit pet_foods_url
    assert_selector "h1", text: "Pet foods"
  end

  test "should create pet food" do
    visit pet_foods_url
    click_on "New pet food"

    fill_in "Food", with: @pet_food.food_id
    fill_in "Frequency", with: @pet_food.frequency_id
    fill_in "Notes", with: @pet_food.notes
    fill_in "Pet", with: @pet_food.pet_id
    fill_in "Started at", with: @pet_food.started_at
    click_on "Create Pet food"

    assert_text "Pet food was successfully created"
    click_on "Back"
  end

  test "should update Pet food" do
    visit pet_food_url(@pet_food)
    click_on "Edit this pet food", match: :first

    fill_in "Food", with: @pet_food.food_id
    fill_in "Frequency", with: @pet_food.frequency_id
    fill_in "Notes", with: @pet_food.notes
    fill_in "Pet", with: @pet_food.pet_id
    fill_in "Started at", with: @pet_food.started_at
    click_on "Update Pet food"

    assert_text "Pet food was successfully updated"
    click_on "Back"
  end

  test "should destroy Pet food" do
    visit pet_food_url(@pet_food)
    click_on "Destroy this pet food", match: :first

    assert_text "Pet food was successfully destroyed"
  end
end
