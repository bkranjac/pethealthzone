class InjuriesController < ApplicationController
  include ApiDelegator
  before_action :set_injury, only: %i[ show edit update destroy ]

  # GET /injuries or /injuries.json
def index
    delegate_to_api(:index)
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @injuries }
    end
  end

  # GET /injuries/1 or /injuries/1.json
def show
    delegate_to_api(:show)
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @injury }
    end
  end

  # GET /injuries/new
def new
    @injury = Injury.new
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @injury }
    end
  end

  # GET /injuries/1/edit
def edit
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @injury }
    end
  end

  # POST /injuries or /injuries.json
  def create
    api = delegate_to_api(:create)

    respond_to do |format|
      if @injury.persisted?
        format.html { redirect_to @injury, notice: "Injury was successfully created." }
        format.json { render json: @injury, status: :created, location: @injury }
      else
        format.html { render template: 'spa/index', layout: false, status: :unprocessable_entity }
        format.json { render json: @injury.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /injuries/1 or /injuries/1.json
  def update
    api = delegate_to_api(:update)

    respond_to do |format|
      if @injury.errors.empty?
        format.html { redirect_to @injury, notice: "Injury was successfully updated.", status: :see_other }
        format.json { render json: @injury, status: :ok, location: @injury }
      else
        format.html { render template: 'spa/index', layout: false, status: :unprocessable_entity }
        format.json { render json: @injury.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /injuries/1 or /injuries/1.json
  def destroy
    delegate_to_api(:destroy)

    respond_to do |format|
      format.html { redirect_to injuries_path, notice: "Injury was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_injury
      @injury = Injury.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def injury_params
      params.expect(injury: [ :description, :severity ])
    end
end
