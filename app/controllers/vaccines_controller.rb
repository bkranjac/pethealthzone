class VaccinesController < ApplicationController
  include ApiDelegator
  before_action :set_vaccine, only: %i[ show edit update destroy ]

  # GET /vaccines or /vaccines.json
  def index
    delegate_to_api(:index)
    respond_to do |format|
      format.html { render template: "spa/index", layout: false }
      format.json { render json: @vaccines }
    end
  end

  # GET /vaccines/1 or /vaccines/1.json
  def show
    delegate_to_api(:show)
    respond_to do |format|
      format.html { render template: "spa/index", layout: false }
      format.json { render json: @vaccine }
    end
  end

  # GET /vaccines/new
  def new
    @vaccine = Vaccine.new
    respond_to do |format|
      format.html { render template: "spa/index", layout: false }
      format.json { render json: @vaccine }
    end
  end

  # GET /vaccines/1/edit
  def edit
    respond_to do |format|
      format.html { render template: "spa/index", layout: false }
      format.json { render json: @vaccine }
    end
  end

  # POST /vaccines or /vaccines.json
  def create
    api = delegate_to_api(:create)

    respond_to do |format|
      if @vaccine.persisted?
        format.html { redirect_to @vaccine, notice: "Vaccine was successfully created." }
        format.json { render json: @vaccine, status: :created, location: @vaccine }
      else
        format.html { render template: "spa/index", layout: false, status: :unprocessable_entity }
        format.json { render json: @vaccine.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /vaccines/1 or /vaccines/1.json
  def update
    api = delegate_to_api(:update)

    respond_to do |format|
      if @vaccine.errors.empty?
        format.html { redirect_to @vaccine, notice: "Vaccine was successfully updated.", status: :see_other }
        format.json { render json: @vaccine, status: :ok, location: @vaccine }
      else
        format.html { render template: "spa/index", layout: false, status: :unprocessable_entity }
        format.json { render json: @vaccine.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /vaccines/1 or /vaccines/1.json
  def destroy
    delegate_to_api(:destroy)

    respond_to do |format|
      format.html { redirect_to vaccines_path, notice: "Vaccine was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_vaccine
      @vaccine = Vaccine.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def vaccine_params
      params.expect(vaccine: [ :name, :frequency_id, :mandatory ])
    end
end
