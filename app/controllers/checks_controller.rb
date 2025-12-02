class ChecksController < ApplicationController
  include ApiDelegator
  before_action :set_check, only: %i[ show edit update destroy ]

  # GET /checks or /checks.json
  def index
    delegate_to_api(:index)
  end

  # GET /checks/1 or /checks/1.json
  def show
    delegate_to_api(:show)
  end

  # GET /checks/new
  def new
    @check = Check.new
  end

  # GET /checks/1/edit
  def edit
  end

  # POST /checks or /checks.json
  def create
    api = delegate_to_api(:create)

    respond_to do |format|
      if @check.persisted?
        format.html { redirect_to @check, notice: "Check was successfully created." }
        format.json { render :show, status: :created, location: @check }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @check.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /checks/1 or /checks/1.json
  def update
    api = delegate_to_api(:update)

    respond_to do |format|
      if @check.errors.empty?
        format.html { redirect_to @check, notice: "Check was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @check }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @check.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /checks/1 or /checks/1.json
  def destroy
    delegate_to_api(:destroy)

    respond_to do |format|
      format.html { redirect_to checks_path, notice: "Check was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_check
      @check = Check.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def check_params
      params.expect(check: [ :check_type, :frequency_id ])
    end
end
