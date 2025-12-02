module Api
  module V1
    class VaccinationSchedulesController < BaseController
      before_action :set_vaccination_schedule, only: %i[ show update destroy ]

      def index
        @vaccination_schedules = VaccinationSchedule.all
        render json: @vaccination_schedules
      end

      def show
        render json: @vaccination_schedule
      end

      def create
        @vaccination_schedule = VaccinationSchedule.new(vaccination_schedule_params)

        if @vaccination_schedule.save
          render json: @vaccination_schedule, status: :created
        else
          render json: { errors: @vaccination_schedule.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @vaccination_schedule.update(vaccination_schedule_params)
          render json: @vaccination_schedule, status: :ok
        else
          render json: { errors: @vaccination_schedule.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @vaccination_schedule.destroy!
        head :no_content
      end

      private

      def set_vaccination_schedule
        @vaccination_schedule = VaccinationSchedule.find(params[:id])
      end

      def vaccination_schedule_params
        params.require(:vaccination_schedule).permit(:pet_id, :vaccine_id, :frequency_id, :date_given, :notes)
      end
    end
  end
end
