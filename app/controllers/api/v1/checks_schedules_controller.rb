module Api
  module V1
    class ChecksSchedulesController < BaseController
      before_action :set_checks_schedule, only: %i[ show update destroy ]

      def index
        @checks_schedules = ChecksSchedule.all
        render json: @checks_schedules
      end

      def show
        render json: @checks_schedule
      end

      def create
        @checks_schedule = ChecksSchedule.new(checks_schedule_params)

        if @checks_schedule.save
          render json: @checks_schedule, status: :created
        else
          render json: { errors: @checks_schedule.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @checks_schedule.update(checks_schedule_params)
          render json: @checks_schedule, status: :ok
        else
          render json: { errors: @checks_schedule.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @checks_schedule.destroy!
        head :no_content
      end

      private

      def set_checks_schedule
        @checks_schedule = ChecksSchedule.find(params[:id])
      end

      def checks_schedule_params
        params.require(:checks_schedule).permit(:pet_id, :check_id, :date_created, :notes, :performed)
      end
    end
  end
end
