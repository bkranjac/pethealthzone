module Api
  module V1
    class MedicationsController < BaseController
      before_action :set_medication, only: %i[ show update destroy ]

      def index
        @medications = Medication.all
        render json: @medications
      end

      def show
        render json: @medication
      end

      def create
        @medication = Medication.new(medication_params)

        if @medication.save
          render json: @medication, status: :created
        else
          render json: { errors: @medication.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @medication.update(medication_params)
          render json: @medication, status: :ok
        else
          render json: { errors: @medication.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @medication.destroy!
        head :no_content
      end

      private

      def set_medication
        @medication = Medication.find(params[:id])
      end

      def medication_params
        params.require(:medication).permit(:name, :amount, :purpose, :expiration_date)
      end
    end
  end
end
