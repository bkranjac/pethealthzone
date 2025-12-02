class MedicationSchedulesController < ApplicationController
  include ApiDelegator
  before_action :set_medication_schedule, only: %i[ show edit update destroy ]

  # GET /medication_schedules or /medication_schedules.json
  def index
    delegate_to_api(:index)
  end

  # GET /medication_schedules/1 or /medication_schedules/1.json
  def show
    delegate_to_api(:show)
  end

  # GET /medication_schedules/new
  def new
    @medication_schedule = MedicationSchedule.new
  end

  # GET /medication_schedules/1/edit
  def edit
  end

  # POST /medication_schedules or /medication_schedules.json
  def create
    api = delegate_to_api(:create)

    respond_to do |format|
      if @medication_schedule.persisted?
        format.html { redirect_to @medication_schedule, notice: "Medication schedule was successfully created." }
        format.json { render :show, status: :created, location: @medication_schedule }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @medication_schedule.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /medication_schedules/1 or /medication_schedules/1.json
  def update
    api = delegate_to_api(:update)

    respond_to do |format|
      if @medication_schedule.errors.empty?
        format.html { redirect_to @medication_schedule, notice: "Medication schedule was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @medication_schedule }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @medication_schedule.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /medication_schedules/1 or /medication_schedules/1.json
  def destroy
    delegate_to_api(:destroy)

    respond_to do |format|
      format.html { redirect_to medication_schedules_path, notice: "Medication schedule was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_medication_schedule
      @medication_schedule = MedicationSchedule.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def medication_schedule_params
      params.expect(medication_schedule: [ :pet_id, :medication_id, :frequency_id, :date_started, :date_ended, :notes ])
    end
end
