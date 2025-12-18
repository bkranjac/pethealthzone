class FrequenciesController < ApplicationController
  include ApiDelegator
  before_action :set_frequency, only: %i[ show edit update destroy ]

  # GET /frequencies or /frequencies.json
  def index
    delegate_to_api(:index)
    respond_to do |format|
      format.html { render template: "spa/index", layout: false }
      format.json { render json: @frequencies }
    end
  end

  # GET /frequencies/1 or /frequencies/1.json
  def show
    delegate_to_api(:show)
    respond_to do |format|
      format.html { render template: "spa/index", layout: false }
      format.json { render json: @frequency }
    end
  end

  # GET /frequencies/new
  def new
    @frequency = Frequency.new
    respond_to do |format|
      format.html { render template: "spa/index", layout: false }
      format.json { render json: @frequency }
    end
  end

  # GET /frequencies/1/edit
  def edit
    respond_to do |format|
      format.html { render template: "spa/index", layout: false }
      format.json { render json: @frequency }
    end
  end

  # POST /frequencies or /frequencies.json
  def create
    api = delegate_to_api(:create)

    respond_to do |format|
      if @frequency.persisted?
        format.html { redirect_to @frequency, notice: "Frequency was successfully created." }
        format.json { render json: @frequency, status: :created, location: @frequency }
      else
        format.html { render template: "spa/index", layout: false, status: :unprocessable_entity }
        format.json { render json: @frequency.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /frequencies/1 or /frequencies/1.json
  def update
    api = delegate_to_api(:update)

    respond_to do |format|
      if @frequency.errors.empty?
        format.html { redirect_to @frequency, notice: "Frequency was successfully updated.", status: :see_other }
        format.json { render json: @frequency, status: :ok, location: @frequency }
      else
        format.html { render template: "spa/index", layout: false, status: :unprocessable_entity }
        format.json { render json: @frequency.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /frequencies/1 or /frequencies/1.json
  def destroy
    delegate_to_api(:destroy)

    respond_to do |format|
      format.html { redirect_to frequencies_path, notice: "Frequency was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_frequency
      @frequency = Frequency.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def frequency_params
      params.expect(frequency: [ :name, :interval_days ])
    end
end
