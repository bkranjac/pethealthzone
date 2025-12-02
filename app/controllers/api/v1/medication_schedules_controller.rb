module Api
  module V1
    class MedicationSchedulesController < BaseController
      before_action :set_medication_schedule, only: %i[ show update destroy ]

      def index
        @medication_schedules = MedicationSchedule.all
        render json: @medication_schedules
      end

      def show
        render json: @medication_schedule
      end

      def create
        @medication_schedule = MedicationSchedule.new(medication_schedule_params)

        if @medication_schedule.save
          render json: @medication_schedule, status: :created
        else
          render json: { errors: @medication_schedule.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @medication_schedule.update(medication_schedule_params)
          render json: @medication_schedule, status: :ok
        else
          render json: { errors: @medication_schedule.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @medication_schedule.destroy!
        head :no_content
      end

      private

      def set_medication_schedule
        @medication_schedule = MedicationSchedule.find(params[:id])
      end

      def medication_schedule_params
        params.require(:medication_schedule).permit(:pet_id, :medication_id, :frequency_id, :date_started, :date_ended, :notes)
      end
    end
  end
end
