class PetFoodsController < ApplicationController
  include ApiDelegator
  before_action :set_pet_food, only: %i[ show edit update destroy ]

  # GET /pet_foods or /pet_foods.json
  def index
    delegate_to_api(:index)
  end

  # GET /pet_foods/1 or /pet_foods/1.json
  def show
    delegate_to_api(:show)
  end

  # GET /pet_foods/new
  def new
    @pet_food = PetFood.new
  end

  # GET /pet_foods/1/edit
  def edit
  end

  # POST /pet_foods or /pet_foods.json
  def create
    api = delegate_to_api(:create)

    respond_to do |format|
      if @pet_food.persisted?
        format.html { redirect_to @pet_food, notice: "Pet food was successfully created." }
        format.json { render :show, status: :created, location: @pet_food }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @pet_food.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /pet_foods/1 or /pet_foods/1.json
  def update
    api = delegate_to_api(:update)

    respond_to do |format|
      if @pet_food.errors.empty?
        format.html { redirect_to @pet_food, notice: "Pet food was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @pet_food }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @pet_food.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /pet_foods/1 or /pet_foods/1.json
  def destroy
    delegate_to_api(:destroy)

    respond_to do |format|
      format.html { redirect_to pet_foods_path, notice: "Pet food was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_pet_food
      @pet_food = PetFood.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def pet_food_params
      params.expect(pet_food: [ :pet_id, :food_id, :started_at, :frequency_id, :notes ])
    end
end
