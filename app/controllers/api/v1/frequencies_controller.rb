module Api
  module V1
    class FrequenciesController < BaseController
      before_action :set_frequency, only: %i[ show update destroy ]

      def index
        @frequencies = Frequency.all
        render json: @frequencies
      end

      def show
        render json: @frequency
      end

      def create
        @frequency = Frequency.new(frequency_params)

        if @frequency.save
          render json: @frequency, status: :created
        else
          render json: { errors: @frequency.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @frequency.update(frequency_params)
          render json: @frequency, status: :ok
        else
          render json: { errors: @frequency.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @frequency.destroy!
        head :no_content
      end

      private

      def set_frequency
        @frequency = Frequency.find(params[:id])
      end

      def frequency_params
        params.require(:frequency).permit(:name, :interval_days)
      end
    end
  end
end
