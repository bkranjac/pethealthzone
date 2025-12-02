module Api
  module V1
    class PetFoodsController < BaseController
      before_action :set_pet_food, only: %i[ show update destroy ]

      def index
        @pet_foods = PetFood.all
        render json: @pet_foods
      end

      def show
        render json: @pet_food
      end

      def create
        @pet_food = PetFood.new(pet_food_params)

        if @pet_food.save
          render json: @pet_food, status: :created
        else
          render json: { errors: @pet_food.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @pet_food.update(pet_food_params)
          render json: @pet_food, status: :ok
        else
          render json: { errors: @pet_food.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @pet_food.destroy!
        head :no_content
      end

      private

      def set_pet_food
        @pet_food = PetFood.find(params[:id])
      end

      def pet_food_params
        params.require(:pet_food).permit(:pet_id, :food_id, :started_at, :frequency_id, :notes)
      end
    end
  end
end
