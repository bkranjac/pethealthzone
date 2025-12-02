module Api
  module V1
    class ChecksController < BaseController
      before_action :set_check, only: %i[ show update destroy ]

      def index
        @checks = Check.all
        render json: @checks
      end

      def show
        render json: @check
      end

      def create
        @check = Check.new(check_params)

        if @check.save
          render json: @check, status: :created
        else
          render json: { errors: @check.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @check.update(check_params)
          render json: @check, status: :ok
        else
          render json: { errors: @check.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @check.destroy!
        head :no_content
      end

      private

      def set_check
        @check = Check.find(params[:id])
      end

      def check_params
        params.require(:check).permit(:check_type, :frequency_id)
      end
    end
  end
end
