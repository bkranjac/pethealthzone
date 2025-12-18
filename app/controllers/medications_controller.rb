class MedicationsController < ApplicationController
  include ApiDelegator
  before_action :set_medication, only: %i[ show edit update destroy ]

  # GET /medications or /medications.json
def index
    delegate_to_api(:index)
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @medications }
    end
  end

  # GET /medications/1 or /medications/1.json
def show
    delegate_to_api(:show)
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @medication }
    end
  end

  # GET /medications/new
def new
    @medication = Medication.new
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @medication }
    end
  end

  # GET /medications/1/edit
def edit
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @medication }
    end
  end

  # POST /medications or /medications.json
  def create
    api = delegate_to_api(:create)

    respond_to do |format|
      if @medication.persisted?
        format.html { redirect_to @medication, notice: "Medication was successfully created." }
        format.json { render json: @medication, status: :created, location: @medication }
      else
        format.html { render template: 'spa/index', layout: false, status: :unprocessable_entity }
        format.json { render json: @medication.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /medications/1 or /medications/1.json
  def update
    api = delegate_to_api(:update)

    respond_to do |format|
      if @medication.errors.empty?
        format.html { redirect_to @medication, notice: "Medication was successfully updated.", status: :see_other }
        format.json { render json: @medication, status: :ok, location: @medication }
      else
        format.html { render template: 'spa/index', layout: false, status: :unprocessable_entity }
        format.json { render json: @medication.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /medications/1 or /medications/1.json
  def destroy
    delegate_to_api(:destroy)

    respond_to do |format|
      format.html { redirect_to medications_path, notice: "Medication was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_medication
      @medication = Medication.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def medication_params
      params.expect(medication: [ :name, :amount, :purpose, :expiration_date ])
    end
end
