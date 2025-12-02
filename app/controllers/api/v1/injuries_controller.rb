module Api
  module V1
    class InjuriesController < BaseController
      before_action :set_injury, only: %i[ show update destroy ]

      def index
        @injuries = Injury.all
        render json: @injuries
      end

      def show
        render json: @injury
      end

      def create
        @injury = Injury.new(injury_params)

        if @injury.save
          render json: @injury, status: :created
        else
          render json: { errors: @injury.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @injury.update(injury_params)
          render json: @injury, status: :ok
        else
          render json: { errors: @injury.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @injury.destroy!
        head :no_content
      end

      private

      def set_injury
        @injury = Injury.find(params[:id])
      end

      def injury_params
        params.require(:injury).permit(:description, :severity)
      end
    end
  end
end
