class VaccinationSchedulesController < ApplicationController
  include ApiDelegator
  before_action :set_vaccination_schedule, only: %i[ show edit update destroy ]

  # GET /vaccination_schedules or /vaccination_schedules.json
def index
    delegate_to_api(:index)
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @vaccination_schedules }
    end
  end

  # GET /vaccination_schedules/1 or /vaccination_schedules/1.json
def show
    delegate_to_api(:show)
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @vaccination_schedule }
    end
  end

  # GET /vaccination_schedules/new
def new
    @vaccination_schedule = VaccinationSchedule.new
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @vaccination_schedule }
    end
  end

  # GET /vaccination_schedules/1/edit
def edit
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @vaccination_schedule }
    end
  end

  # POST /vaccination_schedules or /vaccination_schedules.json
  def create
    api = delegate_to_api(:create)

    respond_to do |format|
      if @vaccination_schedule.persisted?
        format.html { redirect_to @vaccination_schedule, notice: "Vaccination schedule was successfully created." }
        format.json { render json: @vaccination_schedule, status: :created, location: @vaccination_schedule }
      else
        format.html { render template: 'spa/index', layout: false, status: :unprocessable_entity }
        format.json { render json: @vaccination_schedule.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /vaccination_schedules/1 or /vaccination_schedules/1.json
  def update
    api = delegate_to_api(:update)

    respond_to do |format|
      if @vaccination_schedule.errors.empty?
        format.html { redirect_to @vaccination_schedule, notice: "Vaccination schedule was successfully updated.", status: :see_other }
        format.json { render json: @vaccination_schedule, status: :ok, location: @vaccination_schedule }
      else
        format.html { render template: 'spa/index', layout: false, status: :unprocessable_entity }
        format.json { render json: @vaccination_schedule.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /vaccination_schedules/1 or /vaccination_schedules/1.json
  def destroy
    delegate_to_api(:destroy)

    respond_to do |format|
      format.html { redirect_to vaccination_schedules_path, notice: "Vaccination schedule was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_vaccination_schedule
      @vaccination_schedule = VaccinationSchedule.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def vaccination_schedule_params
      params.expect(vaccination_schedule: [ :pet_id, :vaccine_id, :frequency_id, :date_given, :notes ])
    end
end
