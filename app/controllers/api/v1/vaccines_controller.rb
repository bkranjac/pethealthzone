module Api
  module V1
    class VaccinesController < BaseController
      before_action :set_vaccine, only: %i[ show update destroy ]

      def index
        @vaccines = Vaccine.all
        render json: @vaccines
      end

      def show
        render json: @vaccine
      end

      def create
        @vaccine = Vaccine.new(vaccine_params)

        if @vaccine.save
          render json: @vaccine, status: :created
        else
          render json: { errors: @vaccine.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @vaccine.update(vaccine_params)
          render json: @vaccine, status: :ok
        else
          render json: { errors: @vaccine.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @vaccine.destroy!
        head :no_content
      end

      private

      def set_vaccine
        @vaccine = Vaccine.find(params[:id])
      end

      def vaccine_params
        params.require(:vaccine).permit(:name, :frequency_id, :mandatory)
      end
    end
  end
end
