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

    select @pet_food.pet.name, from: "Pet"
    select @pet_food.food.name, from: "Food"
    fill_in "Started at", with: @pet_food.started_at
    select @pet_food.frequency.how_often, from: "Frequency"
    fill_in "Notes", with: @pet_food.notes
    click_on "Create Pet food"

    assert_text "Pet food was successfully created"
    click_on "Back"
  end

  test "should update Pet food" do
    visit pet_food_url(@pet_food)
    click_on "Edit this pet food", match: :first

    select @pet_food.pet.name, from: "Pet"
    select @pet_food.food.name, from: "Food"
    fill_in "Started at", with: @pet_food.started_at
    select @pet_food.frequency.how_often, from: "Frequency"
    fill_in "Notes", with: @pet_food.notes
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
