class InjuryReportsController < ApplicationController
  include ApiDelegator
  before_action :set_injury_report, only: %i[ show edit update destroy ]

  # GET /injury_reports or /injury_reports.json
def index
    delegate_to_api(:index)
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @injury_reports }
    end
  end

  # GET /injury_reports/1 or /injury_reports/1.json
def show
    delegate_to_api(:show)
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @injury_report }
    end
  end

  # GET /injury_reports/new
def new
    @injury_report = InjuryReport.new
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @injury_report }
    end
  end

  # GET /injury_reports/1/edit
def edit
    respond_to do |format|
      format.html { render template: 'spa/index', layout: false }
      format.json { render json: @injury_report }
    end
  end

  # POST /injury_reports or /injury_reports.json
  def create
    api = delegate_to_api(:create)

    respond_to do |format|
      if @injury_report.persisted?
        format.html { redirect_to @injury_report, notice: "Injury report was successfully created." }
        format.json { render json: @injury_report, status: :created, location: @injury_report }
      else
        format.html { render template: 'spa/index', layout: false, status: :unprocessable_entity }
        format.json { render json: @injury_report.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /injury_reports/1 or /injury_reports/1.json
  def update
    api = delegate_to_api(:update)

    respond_to do |format|
      if @injury_report.errors.empty?
        format.html { redirect_to @injury_report, notice: "Injury report was successfully updated.", status: :see_other }
        format.json { render json: @injury_report, status: :ok, location: @injury_report }
      else
        format.html { render template: 'spa/index', layout: false, status: :unprocessable_entity }
        format.json { render json: @injury_report.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /injury_reports/1 or /injury_reports/1.json
  def destroy
    delegate_to_api(:destroy)

    respond_to do |format|
      format.html { redirect_to injury_reports_path, notice: "Injury report was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_injury_report
      @injury_report = InjuryReport.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def injury_report_params
      params.expect(injury_report: [ :pet_id, :injury_id, :body_part, :description, :date ])
    end
end
