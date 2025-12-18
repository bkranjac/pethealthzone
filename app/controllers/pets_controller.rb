class PetsController < ApplicationController
  include ApiDelegator
  before_action :set_pet, only: %i[ show edit update destroy ]

# GET /pets or /pets.json
def index
    delegate_to_api(:index)
    respond_to do |format|
      format.html { render template: "spa/index", layout: false }
      format.json { render json: @pets }
    end
  end

# GET /pets/1 or /pets/1.json
def show
    delegate_to_api(:show)
    respond_to do |format|
      format.html { render template: "spa/index", layout: false }
      format.json { render json: @pet }
    end
  end

# GET /pets/new
def new
    @pet = Pet.new
    respond_to do |format|
      format.html { render template: "spa/index", layout: false }
      format.json { render json: @pet }
    end
  end

# GET /pets/1/edit
def edit
    respond_to do |format|
      format.html { render template: "spa/index", layout: false }
      format.json { render json: @pet }
    end
  end

  # POST /pets or /pets.json
  def create
    api = delegate_to_api(:create)

    respond_to do |format|
      if @pet.persisted?
        format.html { redirect_to @pet, notice: "Pet was successfully created." }
        format.json { render json: @pet, status: :created, location: @pet }
      else
        format.html { render template: "spa/index", layout: false, status: :unprocessable_entity }
        format.json { render json: @pet.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /pets/1 or /pets/1.json
  def update
    api = delegate_to_api(:update)

    respond_to do |format|
      if @pet.errors.empty?
        format.html { redirect_to @pet, notice: "Pet was successfully updated.", status: :see_other }
        format.json { render json: @pet, status: :ok, location: @pet }
      else
        format.html { render template: "spa/index", layout: false, status: :unprocessable_entity }
        format.json { render json: @pet.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /pets/1 or /pets/1.json
  def destroy
    delegate_to_api(:destroy)

    respond_to do |format|
      format.html { redirect_to pets_path, notice: "Pet was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_pet
      @pet = Pet.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def pet_params
      params.expect(pet: [ :pet_type, :breed, :picture, :birthday, :name, :nickname, :date_admitted, :notes, :gender ])
    end
end
