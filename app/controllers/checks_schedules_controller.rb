class ChecksSchedulesController < ApplicationController
  include ApiDelegator
  before_action :set_checks_schedule, only: %i[ show edit update destroy ]

  # GET /checks_schedules or /checks_schedules.json
  def index
    delegate_to_api(:index)
  end

  # GET /checks_schedules/1 or /checks_schedules/1.json
  def show
    delegate_to_api(:show)
  end

  # GET /checks_schedules/new
  def new
    @checks_schedule = ChecksSchedule.new
  end

  # GET /checks_schedules/1/edit
  def edit
  end

  # POST /checks_schedules or /checks_schedules.json
  def create
    api = delegate_to_api(:create)

    respond_to do |format|
      if @checks_schedule.persisted?
        format.html { redirect_to @checks_schedule, notice: "Checks schedule was successfully created." }
        format.json { render :show, status: :created, location: @checks_schedule }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @checks_schedule.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /checks_schedules/1 or /checks_schedules/1.json
  def update
    api = delegate_to_api(:update)

    respond_to do |format|
      if @checks_schedule.errors.empty?
        format.html { redirect_to @checks_schedule, notice: "Checks schedule was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @checks_schedule }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @checks_schedule.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /checks_schedules/1 or /checks_schedules/1.json
  def destroy
    delegate_to_api(:destroy)

    respond_to do |format|
      format.html { redirect_to checks_schedules_path, notice: "Checks schedule was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_checks_schedule
      @checks_schedule = ChecksSchedule.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def checks_schedule_params
      params.expect(checks_schedule: [ :pet_id, :check_id, :date_created, :notes, :performed ])
    end
end
