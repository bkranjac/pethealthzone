class FoodsController < ApplicationController
  include ApiDelegator
  before_action :set_food, only: %i[ show edit update destroy ]

  # GET /foods or /foods.json
  def index
    delegate_to_api(:index)
  end

  # GET /foods/1 or /foods/1.json
  def show
    delegate_to_api(:show)
  end

  # GET /foods/new
  def new
    @food = Food.new
  end

  # GET /foods/1/edit
  def edit
  end

  # POST /foods or /foods.json
  def create
    api = delegate_to_api(:create)

    respond_to do |format|
      if @food.persisted?
        format.html { redirect_to @food, notice: "Food was successfully created." }
        format.json { render :show, status: :created, location: @food }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @food.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /foods/1 or /foods/1.json
  def update
    api = delegate_to_api(:update)

    respond_to do |format|
      if @food.errors.empty?
        format.html { redirect_to @food, notice: "Food was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @food }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @food.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /foods/1 or /foods/1.json
  def destroy
    delegate_to_api(:destroy)

    respond_to do |format|
      format.html { redirect_to foods_path, notice: "Food was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_food
      @food = Food.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def food_params
      params.expect(food: [ :name, :food_type, :amount, :description, :purpose, :notes ])
    end
end
